
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { formatCurrency } from "@/lib/fotmatters"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"

type ProductCardProps = {
    id:string,
    name: string,
    priceIncents: number,
    description: string,
    imagePath: string,
}

export const ProductCard = ({id, name, priceIncents=0,description, imagePath}: ProductCardProps) => {
    return (<Card className="flex overflow-hidden flex-col" key={id}>
        <div className="relative w-full h-auto aspect-video">
            <Image src={imagePath} fill alt={name} />
        </div>
       <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceIncents/100)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="">{description}</p>
        </CardContent> 
        <CardFooter>
            <Button asChild size="lg" className="w-full">
            <Link href="">Purchase</Link>
            </Button>
        </CardFooter>
    </Card>)
}

export const ProductCardSkeleton = () => {
    return (<Card className="flex overflow-hidden flex-col animate-pulse" >
        <div className=" w-full aspect-video bg-gray-300" />
       <CardHeader>
        <CardTitle>
            <div className=" w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
             <div className=" w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
             <div className=" w-full h-4 rounded-full bg-gray-300" />
             <div className=" w-full h-4 rounded-full bg-gray-300" />
             <div className=" w-3/4 h-4 rounded-full bg-gray-300" />
        </CardContent> 
        <CardFooter>
            <Button size="lg" disabled className="w-full"></Button>
        </CardFooter>
    </Card>)
}

export const ProductSkeletonList = () => ['1','2','3','4','5','6'].map(el=><ProductCardSkeleton key={el}/>)