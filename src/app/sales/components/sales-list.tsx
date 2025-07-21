
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search } from "@/app/patients/components/search";
import { getFullName, formatCurrency } from "@/lib/utils";
import type { Patient, Service, Package } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";
import { type SaleWithDetails } from "../page";
import { format } from "date-fns";
import { NewSaleSheet } from "./new-sale-sheet";

interface SalesListProps {
    sales: SaleWithDetails[];
    patients: Patient[];
    services: Service[];
    packages: Package[];
}

export function SalesList({ sales, patients, services, packages }: SalesListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.sales;
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{d.title}</CardTitle>
                </div>
                <NewSaleSheet patients={patients} services={services} packages={packages} />
            </div>
            <div className="pt-4">
                <Search placeholder={d.searchPlaceholder} />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{d.date}</TableHead>
                    <TableHead>{d.patient}</TableHead>
                    <TableHead>{d.item}</TableHead>
                    <TableHead className="text-right">{d.amount}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell>
                            {isClient ? format(new Date(sale.date), "PPP") : ""}
                        </TableCell>
                        <TableCell className="font-medium">
                            <Link href={`/patients/${sale.patient.id}`} className="hover:underline">
                                {getFullName(sale.patient)}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {sale.service ? (
                                <Badge variant="outline">{sale.service.name}</Badge>
                            ) : sale.package ? (
                                <Badge variant="secondary">{sale.package.name}</Badge>
                            ) : (
                                "N/A"
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatCurrency(Number(sale.amount))}
                        </TableCell>
                    </TableRow>
                ))}
                {sales.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            {d.noSalesFound}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
}
