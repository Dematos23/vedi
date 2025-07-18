
"use client";

import * as React from "react";
import { notFound, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PatientWithDetails } from "../page";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Eye, Wand2, Pencil, Save, Info, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summarizeSessionNotes } from "@/ai/flows/summarize-session-notes";
import { useToast } from "@/hooks/use-toast";
import { ExportPdfButton } from "./export-pdf-button";
import { getFullName } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { updatePatient } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

const patientUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  secondname: z.string().optional(),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  secondlastname: z.string().optional(),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type PatientUpdateFormValues = z.infer<typeof patientUpdateSchema>;

export function PatientDetailClient({ patient }: { patient: PatientWithDetails }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.patients;
  const router = useRouter();

  const form = useForm<PatientUpdateFormValues>({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues: {
      name: patient.name || "",
      secondname: patient.secondname || "",
      lastname: patient.lastname || "",
      secondlastname: patient.secondlastname || "",
      email: patient.email || "",
      phone: patient.phone || "",
      address: patient.address || "",
      notes: patient.notes || "",
    },
  });

  const onSubmit = async (data: PatientUpdateFormValues) => {
    try {
      await updatePatient({ id: patient.id, ...data });
      toast({
        title: "Success",
        description: "Patient details have been updated.",
      });
      setIsEditing(false);
      // Refresh the page to get the latest data
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: d.error,
        description: "Failed to update patient details. Please try again.",
      });
      console.error(e);
    }
  };

  const handleSummarize = async () => {
    const notes = form.getValues("notes");
    if (!notes) {
        toast({
            variant: "destructive",
            title: d.error,
            description: d.emptyNotesError,
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
      setError(d.summaryError);
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleCancel = () => {
      form.reset({
        name: patient.name || "",
        secondname: patient.secondname || "",
        lastname: patient.lastname || "",
        secondlastname: patient.secondlastname || "",
        email: patient.email || "",
        phone: patient.phone || "",
        address: patient.address || "",
        notes: patient.notes || "",
      });
      setIsEditing(false);
  }

  if (!patient) {
    notFound();
  }

  const patientFullName = getFullName(patient);

  return (
    <div className="grid gap-6">
      <div id="patient-header" className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="print:hidden">
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{d.backToPatients}</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{patientFullName}</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
           <Card>
            <CardHeader>
                <CardTitle>{d.serviceBalances}</CardTitle>
                <CardDescription>{d.serviceBalancesDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {patient.patientServiceBalances.length > 0 ? (
                    <div className="space-y-4">
                        {patient.patientServiceBalances.map(balance => (
                            <div key={balance.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-medium">{balance.service.name}</p>
                                    <p className="text-sm text-muted-foreground">{balance.used} / {balance.total} {d.used}</p>
                                </div>
                                <Progress value={(balance.used / balance.total) * 100} />
                            </div>
                        ))}
                    </div>
                ): (
                     <p className="text-sm text-muted-foreground text-center py-4">{d.noActiveBalances}</p>
                )}
            </CardContent>
           </Card>
          <Card id="appointment-history">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{d.appointmentHistory}</CardTitle>
               <div className="flex gap-2 print:hidden">
                  <ExportPdfButton patientName={patientFullName} buttonText={d.exportPdf} />
                  <Button onClick={handleSummarize} disabled={isSummarizing || !form.getValues("notes")}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isSummarizing ? d.summarizing : d.summarizeWithAi}
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{d.service}</TableHead>
                    <TableHead>{d.date}</TableHead>
                    <TableHead>{d.status}</TableHead>
                    <TableHead>
                      <span className="sr-only">{d.actions}</span>
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
                                {dictionary.enums.appointmentStatus[appt.status]}
                             </Badge>
                        </TableCell>
                        <TableCell className="text-right print:hidden">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/appointments/${appt.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                {d.view}
                                </Link>
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          {d.noAppointmentsFound}
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
           {isSummarizing && (
            <Card>
              <CardHeader>
                <CardTitle>{d.aiSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          )}
          {error && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">{d.error}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          )}
          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>{d.aiSummary}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="grid gap-6 content-start" id="therapist-notes">
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{d.patientInformation}</CardTitle>
                        <CardDescription>{d.patientInformationDescription}</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">{d.editPatient}</span>
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-4">
                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                            <Info className="h-4 w-4" />
                            <span>{d.contactDetails}</span>
                        </div>
                        {isEditing ? (
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>{d.firstName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="secondname" render={({ field }) => (<FormItem><FormLabel>{d.middleName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="lastname" render={({ field }) => (<FormItem><FormLabel>{d.lastName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="secondlastname" render={({ field }) => (<FormItem><FormLabel>{d.secondLastName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="email" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>{d.email}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>{d.phone}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>{d.address}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        ) : (
                            <div className="grid gap-2 text-sm pl-6">
                                <div className="flex justify-between">
                                    <span className="font-medium text-muted-foreground">{d.email}</span>
                                    <span>{patient.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-muted-foreground">{d.phone}</span>
                                    <span>{patient.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-muted-foreground">{d.address}</span>
                                    <span className="text-right">{patient.address || 'N/A'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                     <div className="grid gap-4">
                        <div className="flex items-center gap-2 font-medium text-muted-foreground">
                            <StickyNote className="h-4 w-4" />
                            <span>{d.therapistNotes}</span>
                        </div>
                        <div className="pl-6">
                            {isEditing ? (
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder={d.startTyping} className="min-h-[150px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {form.getValues("notes") || d.noNotesAdded}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                {isEditing && (
                    <CardFooter className="justify-end gap-2">
                        <Button variant="ghost" onClick={handleCancel} disabled={form.formState.isSubmitting}>{d.cancel}</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? d.saving : d.save}
                        </Button>
                    </CardFooter>
                )}
              </Card>
            </form>
           </Form>
        </div>
      </div>
    </div>
  );
}

    