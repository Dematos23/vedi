
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "@/app/patients/components/search"; // Re-using search component
import { NewServiceSheet } from "./new-service-sheet";
import { ServiceCard } from "./service-card";
import { StatusFilter } from "./status-filter";
import type { Service, User } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { EditServiceSheet } from "./edit-service-sheet";
import Link from "next/link";

interface ServicesListProps {
  services: Service[];
  therapists: User[];
}

export function ServicesList({ services, therapists }: ServicesListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.services;
    const [editingService, setEditingService] = React.useState<Service | null>(null);

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>{d.title}</CardTitle>
                <CardDescription>{d.description}</CardDescription>
            </div>
            <NewServiceSheet therapists={therapists} />
            </div>
            <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:flex-1">
                <Search placeholder={d.searchPlaceholder} />
            </div>
            <div className="w-full md:w-auto">
                <StatusFilter />
            </div>
            </div>
        </CardHeader>
        <CardContent>
             {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {services.length > 0 ? (
                    services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-12 col-span-full">
                        {d.noServicesFound}
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <Table className="hidden md:table">
                <TableHeader>
                    <TableRow>
                        <TableHead>{d.serviceName}</TableHead>
                        <TableHead className="hidden lg:table-cell">{d.descriptionLabel}</TableHead>
                        <TableHead className="text-right">{d.price}</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">{d.duration}</TableHead>
                        <TableHead className="text-center">{d.status}</TableHead>
                        <TableHead><span className="sr-only">{d.actions}</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {services.map((service) => (
                    <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground line-clamp-1">{service.description}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(service.price))}</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">{service.duration} min</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={service.status === 'ACTIVE' ? 'secondary' : 'destructive'}>
                                {dictionary.enums.serviceStatus[service.status]}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                               <Button asChild variant="outline" size="icon">
                                    <Link href={`/services/${service.id}`}>
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">View</span>
                                    </Link>
                               </Button>
                           </div>
                        </TableCell>
                    </TableRow>
                ))}
                {services.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            {d.noServicesFound}
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
             {editingService && (
                <EditServiceSheet 
                    service={editingService} 
                    open={!!editingService} 
                    onOpenChange={(open) => !open && setEditingService(null)} 
                />
            )}
        </CardContent>
        </Card>
    );
}
