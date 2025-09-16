import { ProductSkeletonList } from "@/components/ProductCard";
import { Suspense } from "react";
import { getFullProducts, ProductSuspense } from "../page";

export default function ProductsPage(){
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<ProductSkeletonList/>}>
                <ProductSuspense productsFetcher={getFullProducts}/>
            </Suspense>
            </div>
}

