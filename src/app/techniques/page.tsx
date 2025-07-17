
import prisma from "@/lib/prisma";
import type { Prisma, Technique, UserTechniqueStatus } from "@prisma/client";
import { TechniquesList } from "./components/techniques-list";

export type TechniqueWithTherapistCount = Technique & {
    users: UserTechniqueStatus[];
}

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

  const techniques: TechniqueWithTherapistCount[] = await prisma.technique.findMany({
    where,
    include: {
        users: true
    },
    orderBy: {
        name: 'asc'
    }
  });

  return (
    <TechniquesList techniques={techniques} />
  );
}
