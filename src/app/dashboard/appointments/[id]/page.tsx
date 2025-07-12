import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, DollarSign, BookText } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default async function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      service: true,
    },
  });

  if (!appointment) {
    notFound();
  }

  const { patient, service, date, description } = appointment;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Appointments</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Appointment Details</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>
            Scheduled on {format(date, "PPP 'at' p")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-4">
                <h3 className="font-semibold text-lg">Patient Information</h3>
                <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{`${patient.name} ${patient.lastname}`}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <span className="font-medium text-muted-foreground pl-9">Email</span>
                    <span>{patient.email}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <span className="font-medium text-muted-foreground pl-9">Phone</span>
                    <span>{patient.phone}</span>
                </div>
            </div>
             <div className="grid gap-4">
                <h3 className="font-semibold text-lg">Service Details</h3>
                <div className="flex items-center gap-4">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(service.price)}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{service.duration} minutes</span>
                </div>
            </div>
          </div>

          {description && (
            <div className="grid gap-4">
                <h3 className="font-semibold text-lg">Session Notes</h3>
                <div className="flex items-start gap-4 text-sm">
                    <BookText className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
