
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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Progress } from "@/components/ui/progress";
import type { TherapistWithPerformance } from "../page";


interface TherapistsListProps {
  therapists: TherapistWithPerformance[];
}

export function TherapistsList({ therapists }: TherapistsListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.therapists;

    const maxPerformance = Math.max(...therapists.map(t => (t as any).performance), 0) || 100;

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{d.title}</CardTitle>
                    <CardDescription>{d.description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{d.name}</TableHead>
                <TableHead className="hidden md:table-cell">{d.email}</TableHead>
                <TableHead className="hidden sm:table-cell">{d.assignedPatients}</TableHead>
                <TableHead>{d.performance}</TableHead>
                <TableHead>
                    <span className="sr-only">{d.actions}</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {therapists.map((therapist) => (
                <TableRow key={therapist.id}>
                    <TableCell className="font-medium">{`${therapist.name} ${therapist.lastname}`}</TableCell>
                    <TableCell className="hidden md:table-cell">
                    {therapist.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                    {therapist._count.patients}
                    </TableCell>
                    <TableCell>
                        <Progress value={((therapist as any).performance / maxPerformance) * 100} className="w-full" />
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/therapists/${therapist.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {d.viewPerformance}
                        </Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
                {therapists.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        {d.noTherapistsFound}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
}
