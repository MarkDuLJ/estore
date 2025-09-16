
import { db } from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/fotmatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteDropdownItem } from "./_components/OderActions";


const getOrders = async() => await db.order.findMany({
    select:{
        id: true,
        pricePaidInCents: true,
        product: {select: {name:true}},
        user: {select: {email:true}},
    },
    orderBy: {createdAt: 'desc'}
})

export default  function  OrdersPage() {
    return (
        <>
    <PageHeader>Sales</PageHeader>
    <OrdersTable />
    </>
  )
}

const OrdersTable = async () => {
    const orders = await getOrders();
    // const orders = [
    //     {
    //         email: "a@gmail.com",
    //         id: "12345",
    //         orders: [
    //             {
    //                 pricePaidInCents: 10000,

    //             }
    //         ]
    //     }
    // ]
    if(orders.length === 0) return <p>No Sales Yet</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {orders.map(order => (
                <TableRow key={order.id}>
                    <TableCell>{order.product.name}</TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell>{formatCurrency(order.pricePaidInCents/100)}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DeleteDropdownItem id={order.id}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
} 