
"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUpDown, UsersRound } from "lucide-react";
import { NewAppointmentSheet } from "./new-appointment-sheet";
import { Filters } from "./filters";
import type { Patient, Service } from "@prisma/client";
import { getFullName } from "@/lib/utils";
import type { AppointmentWithDetails } from "../page";
import { useLanguage } from "@/contexts/language-context";

interface AppointmentsListProps {
  appointments: AppointmentWithDetails[];
  allPatients: Patient[];
  allServices: Service[];
  searchParams: {
    query?: string;
    service?: string;
    dateRange?: string;
    sort?: string;
    status?: string;
  };
}

export function AppointmentsList({ appointments, allPatients, allServices, searchParams }: AppointmentsListProps) {
  const { dictionary } = useLanguage();
  const d = dictionary.appointments;
  const { query, service: serviceId, dateRange, sort = "desc", status } = searchParams;
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const currentParams = new URLSearchParams();
  if (query) currentParams.set('query', query);
  if (serviceId) currentParams.set('service', serviceId);
  if (dateRange) currentParams.set('dateRange', dateRange);
  if (status) currentParams.set('status', status);

  const newSortOrder = sort === 'asc' ? 'desc' : 'asc';
  currentParams.set('sort', newSortOrder);
  const sortLink = `/appointments?${currentParams.toString()}`;

  return (
    <Card>
      <CardHeader>
         <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{d.title}</CardTitle>
            </div>
            <NewAppointmentSheet patients={allPatients} services={allServices} />
         </div>
         <Filters allServices={allServices} />
      </CardHeader>
      <CardContent>
         {/* Mobile Card View */}
        <div className="grid gap-4 md:hidden">
            {appointments.map((appt) => (
                <Card key={appt.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base line-clamp-1">
                                    {appt.service ? appt.service.name : 'No Service'}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {isClient ? format(new Date(appt.date), "PPP 'at' p") : ""}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm pt-0">
                         <div className="flex items-center gap-2">
                            <UsersRound className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium truncate">{appt.patients.map(p => getFullName(p)).join(', ')}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center gap-2 pt-2">
                         <Badge variant={appt.status === 'DONE' ? 'secondary' : 'default'} className="mr-auto">
                            {dictionary.enums.appointmentStatus[appt.status]}
                         </Badge>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href={`/appointments/${appt.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {d.view}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            {appointments.length === 0 && (
                <div className="h-24 text-center flex items-center justify-center">
                    <p>{d.noAppointmentsFound}</p>
                </div>
            )}
        </div>

        {/* Desktop Table View */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>{d.patients}</TableHead>
              <TableHead>{d.service}</TableHead>
              <TableHead>
                <Link href={sortLink} className="flex items-center gap-2 hover:underline">
                  {d.date}
                  <ArrowUpDown className="h-4 w-4" />
                </Link>
              </TableHead>
              <TableHead>{d.time}</TableHead>
               <TableHead>{d.status}</TableHead>
              <TableHead>
                <span className="sr-only">{d.actions}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell className="font-medium">
                  {appt.patients.map(p => getFullName(p)).join(', ')}
                </TableCell>
                <TableCell>
                  {appt.service && <Badge variant="outline">{appt.service.name}</Badge>}
                </TableCell>
                <TableCell>
                  {isClient ? format(new Date(appt.date), "PPP") : ""}
                </TableCell>
                <TableCell>
                  {isClient ? format(new Date(appt.date), "p") : ""}
                </TableCell>
                <TableCell>
                  <Badge variant={appt.status === 'DONE' ? 'secondary' : 'default'}>
                    {dictionary.enums.appointmentStatus[appt.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/appointments/${appt.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      {d.view}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {appointments.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    {d.noAppointmentsFound}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
