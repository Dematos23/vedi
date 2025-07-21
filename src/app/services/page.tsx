
import prisma from "@/lib/prisma";
import { ServiceStatus, type Prisma } from "@prisma/client";
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
  
  const where: Prisma.ServiceWhereInput = {
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
    select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        status: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
    },
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
