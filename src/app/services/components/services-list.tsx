
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "@/app/patients/components/search"; // Re-using search component
import { NewServiceSheet } from "./new-service-sheet";
import { ServiceCard } from "./service-card";
import { StatusFilter } from "./status-filter";
import type { Service } from "@prisma/client";
import { useLanguage } from "@/contexts/language-context";

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.services;

    return (
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <div>
                <CardTitle>{d.title}</CardTitle>
                <CardDescription>{d.description}</CardDescription>
            </div>
            <NewServiceSheet />
            </div>
            <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:flex-1">
                <Search placeholder={d.searchPlaceholder} />
            </div>
            <div className="w-full md:w-auto">
                <StatusFilter />
            </div>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.length > 0 ? (
            services.map((service) => (
            <ServiceCard key={service.id} service={service} />
            ))
            ) : (
            <div className="text-center text-muted-foreground py-12 col-span-full">
                {d.noServicesFound}
            </div>
            )}
        </CardContent>
        </Card>
    );
}
