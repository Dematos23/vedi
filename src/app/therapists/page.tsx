
import prisma from "@/lib/prisma";
import { UserType } from "@prisma/client";
import { TherapistsList } from "./components/therapists-list";

export default async function TherapistsPage() {
  const therapists = await prisma.user.findMany({
    where: {
      type: UserType.THERAPIST,
    },
    include: {
        _count: {
            select: { patients: true }
        }
    },
    orderBy: {
        name: 'asc'
    }
  });

  return (
    <TherapistsList therapists={therapists} />
  );
}
