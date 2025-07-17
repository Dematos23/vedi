
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "@/app/patients/components/search"; // Re-using search component
import { NewTechniqueSheet } from "./new-technique-sheet";
import { TechniqueCard } from "./technique-card";
import type { Technique } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";

interface TechniquesListProps {
  techniques: Technique[];
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
            <CardContent className="grid gap-4">
                {techniques.length > 0 ? (
                techniques.map((technique) => (
                <TechniqueCard key={technique.id} technique={technique} />
                ))
                ) : (
                <div className="text-center text-muted-foreground py-12 col-span-full">
                    {d.noTechniquesFound}
                </div>
                )}
            </CardContent>
        </Card>
    );
}
