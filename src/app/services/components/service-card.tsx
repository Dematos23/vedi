
"use client";

import * as React from "react";
import type { Service } from "@prisma/client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { dictionary } = useLanguage();
  const d = dictionary.services;
  
  const isInactive = service.status === 'INACTIVE';

  return (
    <Card className={cn("flex flex-col", isInactive && "bg-muted/50 border-dashed")}>
        <CardHeader className="flex-row items-start justify-between">
            <div className="grid gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="line-clamp-2">{service.name}</CardTitle>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4 flex-grow">
            <div className="flex justify-between items-start">
                <div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {service.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                     <p className="text-xs text-muted-foreground">
                        {service.duration} min
                    </p>
                    <Badge variant={isInactive ? 'destructive' : 'secondary'}>
                        {dictionary.enums.serviceStatus[service.status]}
                    </Badge>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg">{formatCurrency(Number(service.price))}</p>
            </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6 mt-auto">
            <Button asChild variant="secondary" className="w-full">
                <Link href={`/services/${service.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    {d.viewDetails}
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
