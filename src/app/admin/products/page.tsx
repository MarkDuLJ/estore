import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db/db";
import { CheckCircle2, MoreVertical, XCircleIcon } from "lucide-react";
import { formatCurrency } from "@/lib/fotmatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveDropDownItem, DeleteDropdownItem } from "../_components/ProductActions";
export default function AdminProductPage () {
    return<>
    <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
        </Button>
    </div>
    <ProductTable />
    </>
}

const ProductTable = async () => {
    const products = await db.product.findMany({
        select:{
            id: true,
            name: true,
            priceIncents: true,
            isAvailableForPurchase: true,
            _count: {select:{orders: true}},
        },
        orderBy:{name:"asc"}
    })

    if(products.length === 0) return <p>No product found...</p>
    
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0"><span className="sr-only">Available For Purchase</span></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell>
                        {product.isAvailableForPurchase ? <><span className="sr-only">Available</span><CheckCircle2 /></>: <><span className="sr-only">Unavailable</span><XCircleIcon className="text-destructive"/></>}
                    </TableCell>
                    <TableCell>
                        {product.name}
                    </TableCell>
                    <TableCell>
                        {formatCurrency(product.priceIncents/100)}
                    </TableCell>
                    <TableCell>
                        {product._count.orders}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                            <MoreVertical/><span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild><a href={`/admin/products/${product.id}/download`}>Download</a></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/admin/products/${product.id}/edit`}>Edit</Link></DropdownMenuItem>
                                <ActiveDropDownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                                <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}