import { PageHeader } from "@/app/admin/_components/PageHeader"
import { ProductForm } from "@/app/admin/_components/ProductForm"
import { db } from "@/db/db"


export default  async function({params} : {params:Promise<{id: string}>}
) {
    const {id} = await params;
    
    const product = await db.product.findUnique({where: {id}})
    
    return (
        <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm product={product}/>
        </>
    )
}