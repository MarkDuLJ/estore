import { ProductCard, ProductCardSkeleton, ProductSkeletonList } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { db } from "@/db/db"
import { Product } from "@/generated/prisma"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

export default function HomePage(){

    
    return <main className="space-y-12">
    <ProductGridSection productsFetcher={getFeatureProducts} title="Feature Product"/>
    <ProductGridSection productsFetcher={getNewProducts} title="New Arrival"/>
    </main>
}

type ProductGridSectionProps = {
    title: string,
    productsFetcher: () => Promise<Product[]>
}

const ProductGridSection = async ({title, productsFetcher}: ProductGridSectionProps) => {

     return <div className="space-y-6">
        <div className="flex gap-4">
            <h2 className="text-3xl font-bold">{title}</h2>
            <Button variant='outline' asChild>
                <Link href='/products' className="space-x-1">
                <span>View All</span>
                <ArrowRight className="size-4"/>
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<ProductSkeletonList/>}>
            <ProductSuspense productsFetcher={productsFetcher}/>
        </Suspense>
        </div>
    </div>
}

const ProductSuspense = async ({productsFetcher}: {productsFetcher:() => Promise<Product[]>}) => {
     const products = await productsFetcher()
     return products.map(newProd => <ProductCard key={newProd.id}{...newProd}/>)
}

const getNewProducts = () => {
    return db.product.findMany({
        where:{ isAvailableForPurchase: true},
        orderBy:{ createdAt: 'desc'},
        take:5
    })
}

const getFeatureProducts = () => {
    return db.product.findMany({
        where:{ isAvailableForPurchase: true},
        orderBy:{ orders: {_count:'desc'}},
        take:5
    })
}