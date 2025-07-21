
"use client";

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
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Search } from "@/app/patients/components/search";
import { formatCurrency } from "@/lib/utils";
import type { Service, Package, PackageService } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";
import { NewPackageSheet } from "./new-package-sheet";

interface PackageWithServices extends Package {
    packageServices: (PackageService & { service: Service })[];
}

interface PackagesListProps {
    packages: PackageWithServices[];
    services: Service[];
}

export function PackagesList({ packages, services }: PackagesListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.packages;

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{d.title}</CardTitle>
                </div>
                <NewPackageSheet services={services} />
            </div>
            <div className="pt-4">
                <Search placeholder={d.searchPlaceholder} />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{d.packageName}</TableHead>
                    <TableHead className="hidden md:table-cell">{d.services}</TableHead>
                    <TableHead className="text-right">{d.price}</TableHead>
                    <TableHead>
                        <span className="sr-only">{d.actions}</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                            {pkg.packageServices.map(ps => <Badge key={ps.serviceId} variant="secondary">{ps.service.name} (x{ps.quantity})</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(pkg.price))}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                           {/* <Link href={`/packages/${pkg.id}`}> */}
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">{d.edit}</span>
                           {/* </Link> */}
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
                {packages.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            {d.noPackagesFound}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
}
