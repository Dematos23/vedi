
import prisma from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from "date-fns";
import Link from "next/link";
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
import { Eye, ArrowUpDown } from "lucide-react";
import { NewAppointmentSheet } from "./components/new-appointment-sheet";
import { Filters } from "./components/filters";
import type { Prisma } from "@prisma/client";
import { cn, getFullName } from "@/lib/utils";

const getDateRange = (rangeKey: string) => {
    const now = new Date();
    switch (rangeKey) {
        case 'today':
            return { gte: startOfDay(now), lte: endOfDay(now) };
        case 'this_week':
            return { gte: startOfWeek(now), lte: endOfWeek(now) };
        case 'this_month':
            return { gte: startOfMonth(now), lte: endOfMonth(now) };
        case 'this_year':
            return { gte: startOfYear(now), lte: endOfYear(now) };
        case 'next_month':
            const nextMonth = addMonths(now, 1);
            return { gte: startOfMonth(nextMonth), lte: endOfMonth(nextMonth) };
        default:
            return {};
    }
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    service?: string;
    dateRange?: string;
    sort?: string;
  };
}) {
  const { query = "", service: serviceId, dateRange, sort = "desc" } = searchParams;
  
  const dateFilter = dateRange ? getDateRange(dateRange) : {};

  const where: Prisma.AppointmentWhereInput = {
    ...(query && {
      OR: [
        { patients: { some: { name: { contains: query, mode: "insensitive" } } } },
        { patients: { some: { lastname: { contains: query, mode: "insensitive" } } } },
        { service: { name: { contains: query, mode: "insensitive" } } },
      ],
    }),
    ...(serviceId && {
      serviceId: serviceId,
    }),
    ...(dateRange && {
        date: dateFilter,
    })
  };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patients: true,
      service: true,
    },
    orderBy: {
      date: sort === 'asc' ? 'asc' : 'desc',
    },
  });

  const allPatients = await prisma.patient.findMany();
  const allServices = await prisma.service.findMany();

  const currentParams = new URLSearchParams();
  if (query) currentParams.set('query', query);
  if (serviceId) currentParams.set('service', serviceId);
  if (dateRange) currentParams.set('dateRange', dateRange);

  const newSortOrder = sort === 'asc' ? 'desc' : 'asc';
  currentParams.set('sort', newSortOrder);
  const sortLink = `/appointments?${currentParams.toString()}`;

  return (
    <Card>
      <CardHeader>
         <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>
                Manage and schedule your appointments.
              </CardDescription>
            </div>
            <NewAppointmentSheet patients={allPatients} services={allServices} />
         </div>
         <Filters allServices={allServices} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient(s)</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">
                <Link href={sortLink} className="flex items-center gap-2 hover:underline">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </Link>
              </TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
               <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
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
                <TableCell className="hidden md:table-cell">
                  {format(new Date(appt.date), "PPP")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(appt.date), "p")}
                </TableCell>
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
            ))}
             {appointments.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No appointments found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
