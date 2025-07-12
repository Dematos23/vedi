import prisma from "@/lib/prisma";
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewAppointmentSheet } from "./components/new-appointment-sheet";

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      service: true,
    },
    orderBy: {
      date: 'desc'
    }
  });

  const patients = await prisma.patient.findMany();
  const services = await prisma.service.findMany();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            Manage and schedule your appointments.
          </CardDescription>
        </div>
        <NewAppointmentSheet patients={patients} services={services} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
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
                  {format(appt.date, "PPP")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(appt.date, "p")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
