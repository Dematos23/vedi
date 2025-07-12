import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { NoteSummarizer } from "./components/note-summarizer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      appointments: {
        include: {
          service: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: 4,
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Patients</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{patient.name}</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
           <NoteSummarizer patientId={patient.id} initialNotes={patient.notes || ""} />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Email</span>
                <span>{patient.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Phone</span>
                <span>{patient.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Address</span>
                <span className="text-right">{patient.address}</span>
              </div>
               <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Member Since</span>
                <span>{format(patient.createdAt, "PPP")}</span>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.appointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell><Badge variant="outline">{appt.service.name}</Badge></TableCell>
                      <TableCell>{format(appt.date, "PP")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
