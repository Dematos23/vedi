
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, Clock, DollarSign, BookText, Pencil, Save, CheckCircle, ShieldCheck, ShieldAlert, ThumbsUp, ThumbsDown } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency, getFullName } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateAppointmentDescription, completeAppointment, evaluateAppointment } from "@/lib/actions";
import { ExportAppointmentPdfButton } from "./export-appointment-pdf";
import type { SerializableAppointmentWithDetails } from "../page";
import { type AppointmentEvaluation } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";

export function AppointmentDetailClient({ appointmentData }: { appointmentData: SerializableAppointmentWithDetails }) {
  const [appointment, setAppointment] = React.useState(appointmentData);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.appointments;
  const t = dictionary.toasts;
  
  const [formattedDate, setFormattedDate] = React.useState("");

  React.useEffect(() => {
    if (appointment.date) {
      setFormattedDate(format(new Date(appointment.date), "PPP 'at' p"));
    }
  }, [appointment.date]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateAppointmentDescription(appointment.id, appointment.description || "");
      
      const serializableUpdatedAppointment: SerializableAppointmentWithDetails = {
          ...result,
          date: result.date.toISOString(),
      };
      setAppointment(serializableUpdatedAppointment);
      toast({
        title: t.success.title,
        description: t.success.appointmentNotesUpdated,
      });
      setIsEditing(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToUpdateNotes,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (appointment.patients.length > 1) {
        // This is a simplified logic. A real app might have a modal to select which patient's balance to use.
        toast({
            variant: "destructive",
            title: t.error.actionRequired,
            description: t.error.multiPatientCompletion,
        });
        return;
    }
    
    setIsCompleting(true);
    try {
        const patientId = appointment.patients[0].id;
        const result = await completeAppointment(appointment.id, patientId);
        const serializableResult: SerializableAppointmentWithDetails = {
            ...result,
            patients: appointment.patients, // result from action doesn't include relations
            service: appointment.service,
            date: result.date.toISOString(),
        }
        setAppointment(serializableResult);
        toast({
            title: t.success.title,
            description: t.success.appointmentMarkedAsDone,
        });
    } catch(error) {
        const message = error instanceof Error ? error.message : t.error.unknown;
        toast({
            variant: "destructive",
            title: t.error.completionFailed,
            description: message,
        });
    } finally {
        setIsCompleting(false);
    }
  }

  const handleEvaluation = async (evaluation: AppointmentEvaluation) => {
    setIsEvaluating(true);
    try {
      const result = await evaluateAppointment(appointment.id, evaluation);
      const serializableResult: SerializableAppointmentWithDetails = {
        ...result,
        patients: appointment.patients, // result from action doesn't include relations
        service: appointment.service,
        date: result.date.toISOString(),
      };
      setAppointment(serializableResult);
      toast({
        title: t.success.title,
        description: t.success.appointmentEvaluated(evaluation.toLowerCase()),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToEvaluate,
      });
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const { patients, service, description, status, evaluation } = appointment;
  const isGuideUser = true; // Hardcoded for demo purposes

  if (!service) {
    return <div>Service not found for this appointment.</div>;
  }

  const getEvaluationBadgeVariant = () => {
    switch(evaluation) {
        case 'APPROVED': return 'default';
        case 'REJECTED': return 'destructive';
        default: return 'outline';
    }
  }

  const getEvaluationBadgeIcon = () => {
    switch(evaluation) {
        case 'APPROVED': return <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />;
        case 'REJECTED': return <ShieldAlert className="mr-1.5 h-3.5 w-3.5 text-destructive" />;
        default: return <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />;
    }
  }


  return (
    <div id="appointment-view" className="grid gap-6">
      <div className="flex items-center gap-4 print:hidden">
        <Button asChild variant="outline" size="icon">
          <Link href="/appointments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{d.backToAppointments}</span>
          </Link>
        </Button>
        <div className="flex-1">
            <h1 className="text-2xl font-bold">{d.appointmentDetails}</h1>
        </div>
        <div className="flex items-center gap-2">
          {status === 'PROGRAMMED' && (
              <Button onClick={handleComplete} disabled={isCompleting}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isCompleting ? d.completing : d.markAsDone}
              </Button>
          )}
          {isGuideUser && status === 'DONE' && evaluation === 'UNDER_EVALUATION' && (
            <div className="flex gap-2">
                 <Button variant="outline" onClick={() => handleEvaluation('REJECTED')} disabled={isEvaluating}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    {isEvaluating ? d.rejecting : d.reject}
                </Button>
                <Button onClick={() => handleEvaluation('APPROVED')} disabled={isEvaluating}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {isEvaluating ? d.approving : d.approve}
                </Button>
            </div>
          )}
          <ExportAppointmentPdfButton appointmentId={appointment.id} serviceName={service.name} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>
                {formattedDate ? `${d.scheduledOn} ${formattedDate}` : d.loadingDate}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={status === 'DONE' ? 'secondary' : 'default'} className="text-sm">
                  {dictionary.enums.appointmentStatus[status]}
              </Badge>
              {status === 'DONE' && evaluation && (
                <Badge variant={getEvaluationBadgeVariant()} className="text-sm">
                    {getEvaluationBadgeIcon()}
                    {dictionary.enums.appointmentEvaluation[evaluation]}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-4">
                <h3 className="font-semibold text-lg">{d.patientInformation}</h3>
                {patients.map(patient => (
                  <div key={patient.id}>
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{getFullName(patient)}</span>
                    </div>
                    {patient.email && <div className="flex items-center gap-4">
                        <span className="font-medium text-muted-foreground pl-9">{d.email}</span>
                        <span>{patient.email}</span>
                    </div>}
                     {patient.phone && <div className="flex items-center gap-4">
                        <span className="font-medium text-muted-foreground pl-9">{d.phone}</span>
                        <span>{patient.phone}</span>
                    </div>}
                  </div>  
                ))}
            </div>
             <div className="grid gap-4">
                <h3 className="font-semibold text-lg">{d.serviceDetails}</h3>
                <div className="flex items-center gap-4">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(Number(service.price))}</span>
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
            <CardTitle>{d.sessionNotes}</CardTitle>
            <CardDescription>{d.sessionNotesDescription}</CardDescription>
          </div>
          {!isEditing && status === 'PROGRAMMED' && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="print:hidden">
              <Pencil className="mr-2 h-4 w-4" />
              {d.editNotes}
            </Button>
          )}
        </CardHeader>
        <CardContent>
           {isEditing ? (
              <div className="grid gap-4">
                <Textarea 
                  value={description || ""}
                  onChange={(e) => setAppointment({...appointment, description: e.target.value})}
                  placeholder="Enter session notes here..."
                  className="min-h-[150px]"
                />
              </div>
            ) : (
                <div className="flex items-start gap-4 text-sm">
                    <BookText className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">
                        {description || d.noNotes}
                    </p>
                </div>
            )}
        </CardContent>
         {isEditing && (
          <CardFooter className="justify-end gap-2 print:hidden">
            <Button variant="ghost" onClick={() => {
                setIsEditing(false);
                setAppointment(appointmentData); // Reset to original data on cancel
            }} disabled={isSaving}>{d.cancel}</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? d.savingNotes : d.saveNotes}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
