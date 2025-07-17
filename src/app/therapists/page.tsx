
import prisma from "@/lib/prisma";
import { UserType, type User, type UserTechniqueStatus } from "@prisma/client";
import { TherapistsList } from "./components/therapists-list";

export type TherapistWithPerformance = User & {
    _count: {
        patients: number;
        techniques: number;
    };
    techniques: (UserTechniqueStatus & {
        _count: {
            userTechniqueUsageLogs: number;
        };
    })[];
};

export default async function TherapistsPage() {
    const therapistsRaw = await prisma.user.findMany({
        where: {
            type: UserType.THERAPIST,
        },
        include: {
            _count: {
                select: { 
                    patients: true,
                    techniques: true,
                }
            },
            techniques: {
                include: {
                    _count: {
                        select: { userTechniqueUsageLogs: true }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    // Since we can't do a nested aggregate, we sum it here.
    const therapists: TherapistWithPerformance[] = therapistsRaw.map(therapist => {
        const totalUsage = therapist.techniques.reduce((sum, tech) => sum + tech._count.userTechniqueUsageLogs, 0);
        return {
            ...therapist,
            performance: totalUsage,
        } as any; 
    });


  return (
    <TherapistsList therapists={therapists} />
  );
}
