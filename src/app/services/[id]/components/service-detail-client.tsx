
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, Clock, DollarSign, Eye } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, getFullName, cn } from "@/lib/utils";
import type { SerializableServiceWithDetails } from "../page";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { ServiceStatus } from "@prisma/client";

export function ServiceDetailClient({ serviceData }: { serviceData: SerializableServiceWithDetails }) {
  const { name, description, price, duration, status, appointments } = serviceData;
  const isInactive = status === ServiceStatus.INACTIVE;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4 print:hidden">
        <Button asChild variant="outline" size="icon">
          <Link href="/services">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Services</span>
          </Link>
        </Button>
        <div className="flex-1">
            <div className="flex items-center gap-4">
                 <h1 className="text-2xl font-bold">{name}</h1>
                 <Badge variant={isInactive ? 'destructive' : 'secondary'} className="text-sm">
                    {status}
                </Badge>
            </div>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div className="grid gap-0.5">
                    <div className="font-semibold">Price</div>
                    <div className="text-muted-foreground">{formatCurrency(price)}</div>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                 <div className="grid gap-0.5">
                    <div className="font-semibold">Duration</div>
                    <div className="text-muted-foreground">{duration} minutes</div>
                </div>
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>A list of recent appointments using this service.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Patient(s)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.length > 0 ? (
                        appointments.map((appt) => (
                        <TableRow key={appt.id}>
                            <TableCell className="font-medium">
                                {appt.patients.map(p => getFullName(p)).join(', ')}
                            </TableCell>
                            <TableCell>{format(new Date(appt.date), "PPP")}</TableCell>
                            <TableCell>
                                <Badge variant={appt.status === 'DONE' ? 'secondary' : 'default'}>
                                    {appt.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/appointments/${appt.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                                </Link>
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                            No appointments found for this service.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
