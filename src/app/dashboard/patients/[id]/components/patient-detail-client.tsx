
"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import type { PatientWithAppointments } from "../page";

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
import { format } from "date-fns";
import Link from "next/link";
import { NoteSummarizer } from "./note-summarizer";
import { ArrowLeft, Eye, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summarizeSessionNotes } from "@/ai/flows/summarize-session-notes";
import { useToast } from "@/hooks/use-toast";
import { ExportPdfButton } from "./export-pdf-button";
import { formatCurrency } from "@/lib/utils";

// All the interactive logic is in this client component
export function PatientDetailClient({ patient }: { patient: PatientWithAppointments }) {
  const [notes, setNotes] = React.useState(patient.notes || "");
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!notes) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Cannot summarize empty notes.",
        });
        return;
    }
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    try {
      const result = await summarizeSessionNotes({ sessionNotes: notes });
      setSummary(result.summary);
    } catch (e) {
      setError("Failed to generate summary. Please try again.");
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!patient) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div id="patient-header" className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="print:hidden">
          <Link href="/dashboard/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Patients</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{`${patient.name} ${patient.lastname}`}</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
          <Card id="appointment-history">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointment History</CardTitle>
               <div className="flex gap-2 print:hidden">
                  <ExportPdfButton patientName={`${patient.name} ${patient.lastname}`} />
                  <Button onClick={handleSummarize} disabled={isSummarizing || !notes}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isSummarizing ? "Summarizing..." : "Summarize with AI"}
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.appointments.length > 0 ? (
                    patient.appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>
                          <Badge variant="outline" className="border-none rounded-none px-0">{appt.service.name}</Badge>
                        </TableCell>
                        <TableCell>{format(appt.date, "PPP")}</TableCell>
                        <TableCell>{formatCurrency(Number(appt.price))}</TableCell>
                        <TableCell className="text-right print:hidden">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/dashboard/appointments/${appt.id}`}>
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
                          No appointments found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
          <Card id="patient-details">
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
            </CardContent>
          </Card>
           <div id="therapist-notes">
             <NoteSummarizer 
              patientId={patient.id}
              initialNotes={patient.notes || ""}
              onNotesChange={setNotes}
              summary={summary}
              isSummarizing={isSummarizing}
              error={error}
            />
           </div>
        </div>
      </div>
    </div>
  );
}
