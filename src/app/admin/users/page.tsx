
import { db } from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/fotmatters";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteDropdownItem } from "./_components/UserActions";


const getUsers = async() => await db.user.findMany({
    select:{
        id: true,
        email: true,
        orders: true,
    },
    orderBy: {createdAt: 'desc'}
})

export default  function  UserPage() {
    return (
        <>
    <PageHeader>Customers</PageHeader>
    <UserTable />
    </>
  )
}

const UserTable = async () => {
    // const users = await getUsers();
    const users = [
        {
            email: "a@gmail.com",
            id: "12345",
            orders: [
                {
                    pricePaidInCents: 10000,

                }
            ]
        }
    ]
    if(users.length === 0) return <p>No customers</p>

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map(user => (
                <TableRow key={user.email}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatNumber(user.orders.length)}</TableCell>
                    <TableCell>{formatCurrency(
                        user.orders.reduce((sum, c)=> c.pricePaidInCents + sum, 0)/100
                    )}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DeleteDropdownItem id={user.id}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
} 