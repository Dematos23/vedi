
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { TechniquesList } from "./components/techniques-list";

export default async function TechniquesPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
  };
}) {
  const { query = "" } = searchParams;
  
  const where: Prisma.TechniqueWhereInput = {
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

  const techniques = await prisma.technique.findMany({
    where,
    orderBy: {
        name: 'asc'
    }
  });

  return (
    <TechniquesList techniques={techniques} />
  );
}
