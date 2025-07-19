
import prisma from "@/lib/prisma";
import { UserType, type User, type Appointment } from "@prisma/client";
import { TherapistsList } from "./components/therapists-list";
import type { Prisma } from "@prisma/client";

export type TherapistWithPerformance = User & {
    _count: {
        patients: number;
        appointments: number;
    };
};

export default async function TherapistsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";

  const where: Prisma.UserWhereInput = {
      type: UserType.THERAPIST,
  };

  if (query) {
    where.OR = [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        lastname: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: query,
          mode: "insensitive",
        },
      },
    ];
  }


    const therapistsRaw = await prisma.user.findMany({
        where,
        include: {
            _count: {
                select: { 
                    patients: true,
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    const therapists: TherapistWithPerformance[] = await Promise.all(therapistsRaw.map(async (therapist) => {
        const appointmentCount = await prisma.appointment.count({
            where: {
                patients: {
                    some: {
                        userId: therapist.id
                    }
                }
            }
        });

        return {
            ...therapist,
            _count: {
                ...therapist._count,
                appointments: appointmentCount
            },
        } as TherapistWithPerformance;
    }));


  return (
    <TherapistsList therapists={therapists} />
  );
}
