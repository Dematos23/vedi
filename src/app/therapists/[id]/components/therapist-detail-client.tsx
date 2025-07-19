
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UsersRound, CalendarDays, DollarSign, Eye, KeyRound, Copy } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getFullName, cn } from "@/lib/utils";
import { getTherapistPerformance, resetTherapistPassword } from "@/lib/actions";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { TechniqueStatus } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

type Unpacked<T> = T extends (infer U)[] ? U : T;
type PerformanceData = Awaited<ReturnType<typeof getTherapistPerformance>>;

type SerializableAppointment = Omit<Unpacked<PerformanceData['recentAppointments']>, 'date'> & { 
    date: string;
    patients: any[]; 
    service: any;
};

type SerializableTechniquePerformance = Omit<Unpacked<PerformanceData['techniquesPerformance']>, 'createdAt' | 'updatedAt' | 'technique'> & { 
    createdAt: string, 
    updatedAt: string,
    technique: Omit<Unpacked<PerformanceData['techniquesPerformance']>['technique'], 'createdAt' | 'updatedAt'> & {
        createdAt: string,
        updatedAt: string
    }
};

type SerializablePerformanceData = Omit<PerformanceData, 'kpis' | 'recentAppointments' | 'techniquesPerformance'> & {
    kpis: Omit<PerformanceData['kpis'], 'totalSales'> & { totalSales: number };
    recentAppointments: SerializableAppointment[];
    techniquesPerformance: SerializableTechniquePerformance[];
}

interface TherapistDetailClientProps {
  data: SerializablePerformanceData;
}


export function TherapistDetailClient({ data }: TherapistDetailClientProps) {
  const { dictionary } = useLanguage();
  const d = dictionary.therapists;
  const { id, name, lastname, kpis, assignedPatients, techniquesPerformance } = data;
  const [formattedAppointments, setFormattedAppointments] = React.useState<SerializableAppointment[]>([]);
  const [isResetting, setIsResetting] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Format dates on the client to avoid hydration mismatch
    setFormattedAppointments(data.recentAppointments);
  }, [data.recentAppointments]);
  
  const handleResetPassword = async () => {
    setIsResetting(true);
    setNewPassword(null);
    try {
      const result = await resetTherapistPassword(id);
      if (result.newPassword) {
        setNewPassword(result.newPassword);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reset password. Please try again.",
        });
      }
    } catch (error) {
       const message = error instanceof Error ? error.message : "An unknown error occurred";
       toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const copyToClipboard = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      toast({
        title: "Copied!",
        description: "New password has been copied to clipboard.",
      });
    }
  };


  return (
    <>
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/therapists">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{d.backToTherapists}</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{d.performanceTitle(name, lastname)}</h1>
        <div className="ml-auto">
            <Button variant="outline" onClick={handleResetPassword} disabled={isResetting}>
                <KeyRound className="mr-2 h-4 w-4" />
                {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{d.assignedPatients}</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {d.appointmentsThisMonth}
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{kpis.appointmentsThisMonth}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{d.totalSalesGenerated}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalSales)}</div>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
              <CardTitle>{d.techniquePerformance}</CardTitle>
              <CardDescription>{d.techniquePerformanceDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="grid grid-cols-[200px_1fr_80px_120px] items-center gap-4">
                {techniquesPerformance.map(tech => (
                  <React.Fragment key={tech.id}>
                      <span className="font-medium truncate">{tech.technique.name}</span>
                      <Progress value={tech._count.userTechniqueUsageLogs} max={100} />
                      <span className="text-sm font-mono text-muted-foreground text-center">{tech._count.userTechniqueUsageLogs} {d.uses}</span>
                      <Badge 
                        variant={tech.status === TechniqueStatus.PRACTITIONER ? 'secondary' : 'default'}
                        className={cn("justify-center", {
                            "bg-primary hover:bg-primary/90 text-primary-foreground": tech.status === TechniqueStatus.THERAPIST,
                            "bg-secondary hover:bg-secondary/80 text-secondary-foreground": tech.status === TechniqueStatus.PRACTITIONER
                        })}
                      >
                        {dictionary.enums.techniqueStatus[tech.status]}
                      </Badge>
                  </React.Fragment>
                ))}
              </div>
               {techniquesPerformance.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">{d.noTechniquesAssigned}</p>
              )}
          </CardContent>
      </Card>


      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>{d.recentAppointments}</CardTitle>
                <CardDescription>{d.recentAppointmentsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{d.patient}</TableHead>
                        <TableHead>{d.service}</TableHead>
                        <TableHead>{d.date}</TableHead>
                        <TableHead>
                            <span className="sr-only">{d.actions}</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formattedAppointments.length > 0 ? (
                           formattedAppointments.map((appt) => (
                                <TableRow key={appt.id}>
                                    <TableCell>{appt.patients.map(p => getFullName(p)).join(', ')}</TableCell>
                                    <TableCell>
                                        {appt.service && <Badge variant="outline">{appt.service.name}</Badge>}
                                    </TableCell>
                                    <TableCell>{format(new Date(appt.date), "PPP")}</TableCell>
                                    <TableCell className="text-right">
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
                                    {d.noRecentAppointments}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{d.assignedPatients}</CardTitle>
                <CardDescription>{d.assignedPatientsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{d.name}</TableHead>
                        <TableHead className="hidden sm:table-cell">{d.email}</TableHead>
                        <TableHead><span className="sr-only">{d.actions}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignedPatients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{getFullName(patient)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{patient.email}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/patients/${patient.id}`}>
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">{d.viewPatient}</span>
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {assignedPatients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    {d.noPatientsAssigned}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>

    <AlertDialog open={!!newPassword} onOpenChange={(open) => !open && setNewPassword(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Password Reset Successfully</AlertDialogTitle>
          <AlertDialogDescription>
            The therapist's password has been reset. Please provide them with their new password securely.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="relative rounded-lg bg-muted p-4 font-mono text-sm">
            {newPassword}
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
            </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setNewPassword(null)}>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
