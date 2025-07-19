
import prisma from "@/lib/prisma";
import { ServiceStatus, UserType } from "@prisma/client";
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
  
  const therapistsPromise = prisma.user.findMany({
    where: { type: UserType.THERAPIST },
  });

  const techniquesPromise = prisma.technique.findMany();

  const [services, therapists, techniques] = await Promise.all([
    servicesPromise,
    therapistsPromise,
    techniquesPromise
  ]);

  return (
    <ServicesList services={services} therapists={therapists} techniques={techniques} />
  );
}
