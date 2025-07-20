
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BriefcaseMedical, GraduationCap, Pencil } from "lucide-react";
import { getFullName, cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import type { TechniqueWithDetails, UserForAssignment } from "../page";
import { Progress } from "@/components/ui/progress";
import { TechniqueStatus } from "@prisma/client";
import { AssignTherapistsSheet } from "./assign-therapists-sheet";
import { EditTechniqueSheet } from "../../components/edit-technique-sheet";

export function TechniqueDetailClient({ technique, allTherapists }: { technique: TechniqueWithDetails, allTherapists: UserForAssignment[] }) {
  const { name, description, services, users, requiredSessionsForTherapist, url } = technique;
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;
  const [isEditing, setIsEditing] = React.useState(false);

  const assignedTherapistIds = React.useMemo(() => new Set(users.map(u => u.userId)), [users]);
  const availableTherapists = allTherapists.filter(t => !assignedTherapistIds.has(t.id));

  return (
    <>
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/techniques">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{d.backToTechniques}</span>
          </Link>
        </Button>
        <div className="flex-1">
            <h1 className="text-2xl font-bold">{name}</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild size="sm">
                <Link href={url} target="_blank" rel="noopener noreferrer">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {d.enroll}
                </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {d.edit}
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>{d.techniqueDetails}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle>{d.therapistsAssigned}</CardTitle>
                <AssignTherapistsSheet 
                    techniqueId={technique.id} 
                    availableTherapists={availableTherapists}
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">{d.therapist}</TableHead>
                            <TableHead>{d.performance}</TableHead>
                            <TableHead className="text-right w-[120px]">{d.status}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {users.length > 0 ? (
                        users.map(status => (
                            <TableRow key={status.userId}>
                                <TableCell>
                                    <Link href={`/therapists/${status.userId}`} className="hover:underline font-medium">
                                        {getFullName(status.user)}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Progress value={status._count.userTechniqueUsageLogs} max={requiredSessionsForTherapist} className="w-full" />
                                        <span className="text-sm font-mono text-muted-foreground">{status._count.userTechniqueUsageLogs}/{requiredSessionsForTherapist}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge 
                                      variant={status.status === TechniqueStatus.THERAPIST ? 'default' : 'secondary'}
                                      className="justify-center min-w-[100px]"
                                    >
                                        {dictionary.enums.techniqueStatus[status.status]}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                           <TableCell colSpan={3} className="h-24 text-center">
                            {d.noTherapistsFound}
                           </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
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
                                <Badge variant={service.status === 'ACTIVE' ? 'secondary' : 'destructive'} className="ml-auto">{dictionary.enums.serviceStatus[service.status]}</Badge>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{d.noServicesFound}</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
    <EditTechniqueSheet technique={technique} open={isEditing} onOpenChange={setIsEditing} />
    </>
  );
}
