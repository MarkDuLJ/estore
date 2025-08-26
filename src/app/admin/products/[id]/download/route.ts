import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";

export const GET = async (req:NextRequest, {params} : {params: Promise<{id: string}>}) => {
    const {id} = await params
    const product = await db.product.findUnique({
        where: {id},
        select:{ filePath: true, name: true}
    })

    if(!product) return notFound()
    
    const {size } = await fs.stat(product.filePath)
    const file = await fs.readFile(product.filePath)
    const fileUint8 = new Uint8Array(file)
    const extension = product.filePath.split('.').pop()
    
    return new NextResponse(fileUint8, {headers:{
        "Content-Disposition":`attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
    }})
}