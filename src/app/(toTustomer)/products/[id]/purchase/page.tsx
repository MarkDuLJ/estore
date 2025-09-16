import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { CheckoutClient } from "./_components/CheckoutClient";
import { stripe } from "@/app/(toTustomer)/stripe/stripe_instance";


export default async function PurchasePage({
    params
}:{
    params: Promise<{id: string}>
}){
    const {id} = await params;
    
    const product = await db.product.findUnique({where: {id}})
    if(!product) return notFound()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceIncents,
        currency:"USD",
        metadata: {
            productId: product.id,
            productName: product.name
        }
    })

    if(paymentIntent.client_secret === null) {
        throw Error("Payment Intent creation failed...")
    }

    return <CheckoutClient product={product} client_secret={paymentIntent.client_secret}/>
}
