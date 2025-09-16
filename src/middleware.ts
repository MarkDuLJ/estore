
import { NextRequest, NextResponse } from "next/server";
import { isPasswordValid } from "./lib/isPasswordValid";

export const middleware = async (req: NextRequest) => {
    if(( await isAuthenticated(req)) === false){
        return new NextResponse("Unauthorized", {
            status: 401,
            headers:{"WWW-Authenticate":"Basic"}
        })
    }
    
}

const isAuthenticated = async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    if(!authHeader ) return false
    
    /**
     * Sample of Heaer
     * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * authorization: 'Basic YWJjOmNkZQ=='
    */
   const [username, password] = Buffer.from(authHeader.split(" ")[1],"base64").toString().split(":")
   
   const validUser = process.env.ADMIN_USER;
   const validPass = process.env.ADMIN_PASS as string;
   
//    return Promise.resolve(true)
 return username === validUser && (await isPasswordValid(password, validPass))
}

export const config = {
    matcher: "/admin/:path*"
}