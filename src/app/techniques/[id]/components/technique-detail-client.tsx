
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BriefcaseMedical } from "lucide-react";
import { getFullName } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import type { TechniqueWithDetails } from "../page";

export function TechniqueDetailClient({ technique }: { technique: TechniqueWithDetails }) {
  const { name, description, services, userStatuses } = technique;
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/techniques">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{d.backToTechniques}</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>{d.techniqueDetails}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>{d.servicesUsingTechnique}</CardTitle>
            </CardHeader>
            <CardContent>
                {services.length > 0 ? (
                    <div className="space-y-2">
                        {services.map(service => (
                            <Link key={service.id} href={`/services/${service.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                                <BriefcaseMedical className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{service.name}</span>
                                <Badge variant={service.status === 'ACTIVE' ? 'secondary' : 'destructive'} className="ml-auto">{service.status}</Badge>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{d.noServicesFound}</p>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{d.therapistsAssigned}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{d.therapist}</TableHead>
                            <TableHead className="text-right">{d.status}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {userStatuses.length > 0 ? (
                        userStatuses.map(status => (
                            <TableRow key={status.userId}>
                                <TableCell>
                                    <Link href={`/therapists/${status.userId}`} className="hover:underline">
                                        {getFullName(status.user)}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={status.status === 'THERAPIST' ? 'default' : 'secondary'}>{status.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                           <TableCell colSpan={2} className="h-24 text-center">
                            {d.noTherapistsFound}
                           </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
