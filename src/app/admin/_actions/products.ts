'use server'

import fs from "fs/promises";

import { db } from "@/db/db";
import * as z from "zod";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File)

const newProductSchema = z.object({
    name: z.string().min(2, {
  error: (iss) => {
    iss.input;
    iss.minimum; // the minimum value
    iss.inclusive; // whether the minimum is inclusive
    return `Name must have ${iss.minimum} characters or more`;
  }}),
    description: z.string({error:"At least one letter for description..."}).min(1),
    priceInCents: z.coerce.number().int().positive({error:"For price, have to be a positive number"}),
    file: fileSchema,
    image: fileSchema,
})

const editProductSchema = newProductSchema.extend({
    file: fileSchema.optional(),
    image:fileSchema.optional(),
})

export const addProduct = async(prev:unknown, formData: FormData) => {
    const result = newProductSchema.safeParse(Object.fromEntries(formData))
    if(!result.success){
        const messages = result.error.issues.reduce<Record<string, string>>(
            (acc, issue) => {
                const key = issue.path.join("."); // turn ['user','email'] → 'user.email'
                acc[key] = issue.message;
                return acc;
            },
            {}
            );
        return messages
    }
    
    const data = result.data;

    await fs.mkdir("products", {recursive: true})
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    
    await fs.mkdir("public/products", {recursive: true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    
    await db.product.create({
        data:{
            isAvailableForPurchase: false,
            name: data.name,
            description: data.description,
            priceIncents: data.priceInCents,
            filePath,
            imagePath,
        }
    })

    // recheck cache every time after add new product
    revalidatePath('/')
    revalidatePath('/products')
    redirect("/admin/products")
}
export const toggleProductAvailability = async (id: string, isAvailableForPurchase: boolean) => {
 await db.product.update({where:{id}, data: {isAvailableForPurchase}})

    revalidatePath('/')
    revalidatePath('/products')
}

export const deleteProduct = async (id: string) => {
   const deletedProduct =  await db.product.delete({where: {id}})

   if(deletedProduct === null) return notFound()

    await fs.unlink( deletedProduct.filePath)
    await fs.unlink( `public${deletedProduct.imagePath}`)

    revalidatePath('/')
    revalidatePath('/products')

}

export const updateProduct = async (id: string, prev: unknown, formData:FormData) => {
    const result = editProductSchema.safeParse(Object.fromEntries(formData))
    if(!result.success){
        const messages = result.error.issues.reduce<Record<string, string>>(
            (acc, issue) => {
                const key = issue.path.join("."); // turn ['user','email'] → 'user.email'
                acc[key] = issue.message;
                return acc;
            },
            {}
            );
        return messages
    }

    const data = result.data
    const product = await db.product.findUnique({where: {id}})
    if(!product) return notFound()

    let filePath = product.filePath
    if(data.file && data.file.size > 0){
        await fs.unlink(product.filePath)
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    }

    let imagePath = product.imagePath
    if(data.image && data.image.size > 0){
        await fs.unlink(`public${product.imagePath}`)
        imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }
    
    await db.product.update({
        where: {id},
        data:{
            isAvailableForPurchase: product.isAvailableForPurchase || false,
            name: data.name,
            description: data.description,
            priceIncents:data.priceInCents,
            filePath,
            imagePath,
        }
    })

    revalidatePath('/')
    revalidatePath('/products')

    redirect('/admin/products')
}