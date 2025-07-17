
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, UsersRound, CalendarDays, DollarSign, Eye } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getFullName } from "@/lib/utils";
import type { getTherapistPerformance } from "@/lib/actions";

type Unpacked<T> = T extends (infer U)[] ? U : T;
type PerformanceData = Awaited<ReturnType<typeof getTherapistPerformance>>;
type SerializableAppointment = Omit<Unpacked<PerformanceData['recentAppointments']>, 'date'> & { date: string };
type SerializablePerformanceData = Omit<PerformanceData, 'kpis' | 'recentAppointments'> & {
    kpis: Omit<PerformanceData['kpis'], 'totalSales'> & { totalSales: number };
    recentAppointments: SerializableAppointment[];
}

interface TherapistDetailClientProps {
  data: SerializablePerformanceData;
}

export function TherapistDetailClient({ data }: TherapistDetailClientProps) {
  const { name, lastname, kpis, assignedPatients, recentAppointments } = data;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/therapists">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Therapists</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{`Dr. ${name} ${lastname}'s Performance`}</h1>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appointments (This Month)
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{kpis.appointmentsThisMonth}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalSales)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Assigned Patients</CardTitle>
                <CardDescription>Patients currently under this therapist's care.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
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
                                            <span className="sr-only">View Patient</span>
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Last 10 appointments involving their patients.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Patient(s)</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentAppointments.map((appt) => (
                            <TableRow key={appt.id}>
                                <TableCell>{appt.patients.map(getFullName).join(', ')}</TableCell>
                                <TableCell>
                                    {appt.service && <Badge variant="outline">{appt.service.name}</Badge>}
                                </TableCell>
                                <TableCell>{format(new Date(appt.date), "PPP")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
