
import prisma from "@/lib/prisma";
import { PackagesList } from "./components/packages-list";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
  };
}) {
  const { query = "" } = searchParams;
  
  const packagesPromise = prisma.package.findMany({
    where: {
        OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ]
    },
    include: {
        packageServices: {
            include: {
                service: true
            }
        },
    },
    orderBy: {
        name: 'asc'
    }
  });

  const servicesPromise = prisma.service.findMany({ where: { status: 'ACTIVE' } });
  
  const [packages, services] = await Promise.all([packagesPromise, servicesPromise]);

  return (
    <PackagesList 
      packages={packages}
      services={services}
    />
  );
}
