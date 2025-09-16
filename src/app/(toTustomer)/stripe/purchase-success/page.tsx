import Image from "next/image";
import {Stripe} from "stripe";

import { stripe } from "@/app/(toTustomer)/stripe/stripe_instance";
import { notFound } from "next/navigation";
import { db } from "@/db/db";
import { formatCurrency } from "@/lib/fotmatters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// const stripe = new Stripe(apikey)
export default async function SuccessPage({searchParams}:{
    searchParams:Promise<{
       payment_intent: string, 
    }>
}) {

    const {payment_intent} = await searchParams
    
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

    if(!paymentIntent.metadata.productId) return notFound()

    const product = await db.product.findUnique({
        where: {id: paymentIntent.metadata.productId}
    })
    if(!product) return notFound()

    // const isSucceed = false
    const isSucceed = paymentIntent.status === 'succeeded'
    
    return <div className="max-w-5xl w-full mx-auto space-y-8">
        <h1 className="text-2xl font-bold">{isSucceed? "Success": "Error"}</h1>
        <div className="flex gap-4 items-center">
        <div className="aspect-video overflow-hidden w-1/3 relative">
        <Image src={product.imagePath} fill alt={product.name} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
        </div>
        <div>
            <div className="text-lg">{formatCurrency(product.priceIncents/100)}</div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
            <Button className="mt-4" size='lg' asChild>
                {isSucceed?<a href={`/products/download/${await createDownloadVerification(product.id)}`}>Download</a>: <Link href={`/products/${product.id}/purchase`}>Try Again</Link>}
                </Button>
        </div>
        </div>
    </div>
}

const createDownloadVerification = async (productId: string) => {
    const verification = await db.downloadVerification.create({data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }})
    return verification.id
}