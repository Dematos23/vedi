
import prisma from "@/lib/prisma";
import { ServiceStatus } from "@prisma/client";
import { ServicesList } from "./components/services-list";

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

  const servicesPromise = prisma.service.findMany({
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

  const techniquesPromise = prisma.technique.findMany();

  const [services, techniques] = await Promise.all([
    servicesPromise,
    techniquesPromise
  ]);

  return (
    <ServicesList services={services} techniques={techniques} />
  );
}
