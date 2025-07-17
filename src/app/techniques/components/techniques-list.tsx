
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
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Search } from "@/app/patients/components/search";
import { NewTechniqueSheet } from "./new-technique-sheet";
import { useLanguage } from "@/contexts/language-context";
import type { TechniqueWithTherapistCount } from "../page";
import { Badge } from "@/components/ui/badge";

interface TechniquesListProps {
  techniques: TechniqueWithTherapistCount[];
}

export function TechniquesList({ techniques }: TechniquesListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.techniques;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{d.title}</CardTitle>
                    <CardDescription>{d.description}</CardDescription>
                </div>
                <NewTechniqueSheet />
                </div>
                <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1">
                    <Search placeholder={d.searchPlaceholder} />
                </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Mobile Card View */}
                <div className="grid gap-4 md:hidden">
                    {techniques.map((technique) => (
                        <Card key={technique.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                         <CardTitle className="text-base line-clamp-2">{technique.name}</CardTitle>
                                         <CardDescription className="text-xs pt-1">{technique.description}</CardDescription>
                                    </div>
                                    <Badge variant="secondary">{technique.users.length} {d.therapists}</Badge>
                                </div>
                            </CardHeader>
                            <CardFooter>
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={`/techniques/${technique.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        {d.view}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {techniques.length === 0 && (
                        <div className="h-24 text-center flex items-center justify-center">
                             <p>{d.noTechniquesFound}</p>
                        </div>
                    )}
                </div>


                {/* Desktop Table View */}
                <Table className="hidden md:table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>{d.techniqueName}</TableHead>
                            <TableHead className="hidden md:table-cell">{d.descriptionLabel}</TableHead>
                            <TableHead className="text-center">{d.therapists}</TableHead>
                            <TableHead>
                                <span className="sr-only">{d.actions}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {techniques.map((technique) => (
                            <TableRow key={technique.id}>
                                <TableCell className="font-medium">{technique.name}</TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground line-clamp-2">
                                    {technique.description}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {technique.users.length}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/techniques/${technique.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            {d.view}
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {techniques.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    {d.noTechniquesFound}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
