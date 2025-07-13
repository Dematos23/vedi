
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Search } from "../patients/components/search";
import { NewServiceSheet } from "./components/new-service-sheet";
import { ServiceCard } from "./components/service-card";
import { StatusFilter } from "./components/status-filter";
import type { ServiceStatus } from "@prisma/client";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    status?: string;
  };
}) {
  const { query = "", status } = searchParams;
  
  const where: any = {
    OR: [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query,
          mode: "insensitive",
        },
      },
    ],
  };

  if (status && (status === 'ACTIVE' || status === 'INACTIVE')) {
    where.status = status as ServiceStatus;
  }


  const services = await prisma.service.findMany({
    where,
    orderBy: [
      {
        status: 'asc' // Show ACTIVE ones first
      },
      {
        name: 'asc'
      }
    ]
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              A list of all registered services.
            </CardDescription>
          </div>
          <NewServiceSheet />
        </div>
        <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:flex-1">
            <Search placeholder="Search by service name or description..." />
          </div>
          <div className="w-full md:w-auto">
            <StatusFilter />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {services.length > 0 ? (
          services.map((service) => (
           <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No services found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
