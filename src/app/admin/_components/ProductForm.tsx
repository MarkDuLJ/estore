'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/fotmatters"
import { useActionState, useState } from "react"
import { addProduct, updateProduct } from "../_actions/products"
import { Product } from "@/generated/prisma"

export const ProductForm = ({product}: {product?:Product | null}) => {
    const [state, action,pending] = useActionState(!product? addProduct:updateProduct.bind(null, product.id), {})
    const [priceInCents, setPriceInCents] = useState<number>(0);

    return <form action={action}  className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="name">Price In Cents</Label>
            <Input type="number" id="priceInCents" name="priceInCents" required defaultValue={product?.priceIncents || priceInCents} onChange={e => setPriceInCents(Number(e.target.value))}/>
        <div>{formatCurrency((product?.priceIncents||priceInCents) / 100)}</div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea  id="description" name="description" required defaultValue={product?.description}/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product === null} />
            {product && <div className="text-muted-foreground">{product.filePath}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product === null}/>
            {product && <div className="text-muted-foreground">{product.imagePath}</div>}
        </div>
            {JSON.stringify(state) !== '{}' && <div className="text-destructive">{JSON.stringify(state)}</div>}
        <Button type="submit" disabled={pending}>{pending?"Saving...":"Save"}</Button>
    </form>
}
