
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

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const services = await prisma.service.findMany({
    where: {
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
    },
    orderBy: {
      name: 'asc'
    }
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
        <div className="pt-4">
          <Search placeholder="Search by service name or description..." />
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
