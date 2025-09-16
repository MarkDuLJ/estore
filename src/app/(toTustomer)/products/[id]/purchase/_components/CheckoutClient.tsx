'use client'

import { userOrderExist } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/generated/prisma";
import { formatCurrency } from "@/lib/fotmatters";
import { Elements, LinkAuthenticationElement, PaymentElement, useCheckout, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";


type CheckoutFormProps = {
  product: {
    imagePath: string,
    name: string,
    priceIncents: number,
    description: string,
    id: string
  };
  client_secret: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export function CheckoutClient({ product, client_secret }: CheckoutFormProps) {


  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <div className="flex gap-4 items-center">
      <div className="aspect-video overflow-hidden w-1/3 relative">
        <Image src={product.imagePath} fill alt={product.name}/>
      </div>
      <div>
        <div className="text-lg">{formatCurrency(product.priceIncents/100)}</div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
      </div>
      </div>
    <Elements stripe={stripePromise} options={{clientSecret: client_secret}}>
      <CheckoutForm priceIncents={product.priceIncents} productId={product.id}/>
    </Elements>
    </div>
  );
}

const CheckoutForm = ({priceIncents, productId}: {
  priceIncents: number,
  productId: string
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState<string>()

  const disabled = !(stripe && elements)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsloading(true)
    
    
    if(disabled || email === null) return 
    
    //  check if order exists
    const isOrderExist = await userOrderExist(email!, productId)
    if(isOrderExist) {
      setErrorMessage("You already have this product, pls download it from MyOrder page")
      setIsloading(false)
      return
    }
   
   stripe.confirmPayment({
    elements,
    confirmParams:{
      return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
    }
   }).then(({error}) => {
    if(error.type === 'validation_error' || error.type === 'card_error'){
      setErrorMessage(error.message!)
    } else{
      setErrorMessage("Unkown error, pls contact with app owner.")
    }
   }).finally(() => setIsloading(false))

  }

  return   (
  <form onSubmit={handleSubmit}>
    <Card>
      <CardHeader>
      <CardTitle>Checkout</CardTitle>
      {errorMessage && <CardDescription className="text-destructive">{errorMessage}</CardDescription>}
    </CardHeader>
    <CardContent>
    <PaymentElement />
    <div className="mb-4">
    <LinkAuthenticationElement onChange={e => setEmail(e.value.email)}/>
    </div>
    </CardContent>
      <CardFooter className="mt-2">
        <Button className="w-full" size="lg" disabled={disabled || isLoading}>{isLoading?"Purchasing...":`Purchase - ${formatCurrency(priceIncents/100)}`}</Button>
      </CardFooter>
    </Card>
  </form>
  )
}

