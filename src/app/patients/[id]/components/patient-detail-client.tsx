
"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import type { PatientWithDetails } from "../page";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { formatCurrency, getFullName } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// All the interactive logic is in this client component
export function PatientDetailClient({ patient }: { patient: PatientWithDetails }) {
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
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Patients</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{getFullName(patient)}</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
           <Card>
            <CardHeader>
                <CardTitle>Service Balances</CardTitle>
                <CardDescription>Purchased service sessions and their usage.</CardDescription>
            </CardHeader>
            <CardContent>
                {patient.patientServiceBalances.length > 0 ? (
                    <div className="space-y-4">
                        {patient.patientServiceBalances.map(balance => (
                            <div key={balance.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-medium">{balance.service.name}</p>
                                    <p className="text-sm text-muted-foreground">{balance.used} / {balance.total} used</p>
                                </div>
                                <Progress value={(balance.used / balance.total) * 100} />
                            </div>
                        ))}
                    </div>
                ): (
                     <p className="text-sm text-muted-foreground text-center py-4">No active service balances.</p>
                )}
            </CardContent>
           </Card>
          <Card id="appointment-history">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointment History</CardTitle>
               <div className="flex gap-2 print:hidden">
                  <ExportPdfButton patientName={getFullName(patient)} />
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
                    <TableHead>Status</TableHead>
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
                          {appt.service ? (
                            <Badge variant="outline">{appt.service.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>{format(appt.date, "PPP")}</TableCell>
                        <TableCell>
                             <Badge variant={appt.status === 'DONE' ? 'secondary' : 'default'}>
                                {appt.status}
                             </Badge>
                        </TableCell>
                        <TableCell className="text-right print:hidden">
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
                          No appointments found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 content-start">
          <Card id="patient-details">
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Email</span>
                <span>{patient.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Phone</span>
                <span>{patient.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Address</span>
                <span className="text-right">{patient.address || 'N/A'}</span>
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
