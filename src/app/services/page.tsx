
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
  
  const therapists = await prisma.user.findMany({
    where: { type: UserType.THERAPIST },
  });

  return (
    <ServicesList services={services} therapists={therapists} />
  );
}
