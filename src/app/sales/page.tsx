
import prisma from "@/lib/prisma";
import { SalesList } from "./components/sales-list";
import type { Sale, Patient, Service, Package } from "@prisma/client";

export type SaleWithDetails = Sale & {
    patient: Patient;
    service: Service | null;
    package: Package | null;
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
  };
}) {
  const { query = "" } = searchParams;
  
  const sales: SaleWithDetails[] = await prisma.sale.findMany({
    where: {
        OR: [
            { patient: { name: { contains: query, mode: "insensitive" } } },
            { patient: { lastname: { contains: query, mode: "insensitive" } } },
            { service: { name: { contains: query, mode: "insensitive" } } },
            { package: { name: { contains: query, mode: "insensitive" } } },
        ]
    },
    include: {
        patient: true,
        service: true,
        package: true,
    },
    orderBy: {
        date: 'desc'
    }
  });

  const patients = await prisma.patient.findMany();
  const services = await prisma.service.findMany({ where: { status: 'ACTIVE' } });
  const packages = await prisma.package.findMany();

  return (
    <SalesList 
      sales={sales}
      patients={patients}
      services={services}
      packages={packages}
    />
  );
}
