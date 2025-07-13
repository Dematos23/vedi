
import prisma from "@/lib/prisma";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { NewAppointmentSheet } from "./components/new-appointment-sheet";
import { Search } from "../patients/components/search";
import { MultiSelect } from "@/components/ui/multi-select";
import { Filters } from "./components/filters";
import type { Prisma } from "@prisma/client";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    services?: string;
    orderBy?: "asc" | "desc";
  };
}) {
  const { query = "", services: servicesParam, orderBy = "desc" } = searchParams;
  const serviceIds = servicesParam ? servicesParam.split(',') : [];

  const where: Prisma.AppointmentWhereInput = {
    ...(query && {
      OR: [
        { patient: { name: { contains: query, mode: "insensitive" } } },
        { patient: { lastname: { contains: query, mode: "insensitive" } } },
        { service: { name: { contains: query, mode: "insensitive" } } },
      ],
    }),
    ...(serviceIds.length > 0 && {
      serviceId: {
        in: serviceIds,
      },
    }),
  };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      service: true,
    },
    orderBy: {
      date: orderBy,
    },
  });

  const allPatients = await prisma.patient.findMany();
  const allServices = await prisma.service.findMany();

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
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell className="font-medium">{`${appt.patient.name} ${appt.patient.lastname}`}</TableCell>
                <TableCell>
                  <Badge variant="outline">{appt.service.name}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(appt.date), "PPP")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(appt.date), "p")}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/appointments/${appt.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {appointments.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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
