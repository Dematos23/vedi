
"use client";

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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Search } from "./search";
import { NewPatientSheet } from "./new-patient-sheet";
import { getFullName } from "@/lib/utils";
import type { Patient } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";

interface PatientsListProps {
    patients: Patient[];
}

export function PatientsList({ patients }: PatientsListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.patients;

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{d.title}</CardTitle>
                </div>
                <NewPatientSheet />
            </div>
            <div className="pt-4">
                <Search placeholder={d.searchPlaceholder} />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{d.name}</TableHead>
                <TableHead className="hidden md:table-cell">{d.email}</TableHead>
                <TableHead className="hidden md:table-cell">{d.phone}</TableHead>
                <TableHead>
                    <span className="sr-only">{d.actions}</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.map((patient) => (
                <TableRow key={patient.id}>
                    <TableCell className="font-medium">{getFullName(patient)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                    {patient.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                    {patient.phone && <Badge variant="outline" className="px-4 py-1">{patient.phone}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/patients/${patient.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {d.view}
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
                {patients.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                        {d.noResults}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
}
