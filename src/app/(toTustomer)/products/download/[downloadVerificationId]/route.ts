import { db } from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "node:fs/promises"

export const GET = async (req: NextRequest, {params}: {
    params: {
        downloadVerificationId: string
    }
}) => {
    const {downloadVerificationId} = await params
    const data = await db.downloadVerification.findUnique({
        where:{
            id: downloadVerificationId,
            expiresAt: {
                gt: new Date(Date.now())
            }
        },
        select:{product: {select: {name: true, filePath: true}}}
    })

    if(!data) return NextResponse.redirect(new URL("/products/download/expired", req.url))
    
    const {size} = await stat(data.product.filePath)
    const file = await readFile(data.product.filePath)
    const fileUint8 = new Uint8Array(file)
    const extension = data.product.filePath.split(".").pop()

    return new NextResponse(fileUint8, {
        headers: {
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-length": size.toString()
        }
    })
} 