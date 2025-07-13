
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, Clock, DollarSign, BookText, Pencil, Save } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateAppointmentDescription } from "@/lib/actions";
import { ExportAppointmentPdfButton } from "./export-appointment-pdf";
import type { AppointmentWithDetails } from "../page";

// This is now a dedicated client component
export function AppointmentDetailClient({ appointmentData }: { appointmentData: AppointmentWithDetails }) {
  const [appointment, setAppointment] = React.useState(appointmentData);
  const [description, setDescription] = React.useState(appointment.description || "");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedAppointment = await updateAppointmentDescription(appointment.id, description);
      setAppointment(updatedAppointment as AppointmentWithDetails);
      toast({
        title: "Success",
        description: "Appointment notes have been updated.",
      });
      setIsEditing(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const { patient, service, date } = appointment;

  return (
    <div id="appointment-view" className="grid gap-6">
      <div className="flex items-center gap-4 print:hidden">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Appointments</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Appointment Details</h1>
        <div className="ml-auto">
          <ExportAppointmentPdfButton appointmentId={appointment.id} serviceName={service.name} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{service.name}</CardTitle>
          <CardDescription>
            Scheduled on {format(new Date(date), "PPP 'at' p")}
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
                    <span className="font-medium">{formatCurrency(Number(appointment.price))}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{service.duration} minutes</span>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
           <div className="grid gap-2">
            <CardTitle>Session Notes</CardTitle>
            <CardDescription>View or edit session notes below.</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="print:hidden">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Notes
            </Button>
          )}
        </CardHeader>
        <CardContent>
           {isEditing ? (
              <div className="grid gap-4">
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter session notes here..."
                  className="min-h-[150px]"
                />
              </div>
            ) : (
                <div className="flex items-start gap-4 text-sm">
                    <BookText className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                        {description || "No notes have been added for this session yet."}
                    </p>
                </div>
            )}
        </CardContent>
         {isEditing && (
          <CardFooter className="justify-end gap-2 print:hidden">
            <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
