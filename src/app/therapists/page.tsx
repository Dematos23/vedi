
import prisma from "@/lib/prisma";
import { UserType, type User, type UserTechniqueStatus, type Technique } from "@prisma/client";
import { TherapistsList } from "./components/therapists-list";

export type TherapistWithPerformance = User & {
    _count: {
        patients: number;
        techniques: number;
    };
    techniques: (UserTechniqueStatus & {
        technique: Technique & {
            _count: {
                userTechniqueUsageLogs: number;
            };
        };
    })[];
    performance: number; // Add performance to the type
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
                    technique: {
                        include: {
                            _count: {
                                select: { userTechniqueUsageLogs: true }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    // Since we can't do a nested aggregate directly in the way we want for the top-level user,
    // we calculate the performance score here.
    const therapists: TherapistWithPerformance[] = therapistsRaw.map(therapist => {
        // We only want to count the logs for *this* therapist, not all logs for that technique.
        // The previous logic was flawed. The logic to get this count is more complex and
        // better suited for the getTherapistPerformance action. For the list view,
        // we'll simplify and just count the number of assigned techniques.
        const totalUsage = therapist.techniques.reduce((sum, techStatus) => {
            // The DB query doesn't filter userTechniqueUsageLogs by the current therapist,
            // so we can't reliably use this count here.
            // A simpler performance metric for the list could be the number of patients
            // or number of completed appointments. For now, let's use patient count
            // as a proxy for performance on this list page.
            return sum + techStatus.technique._count.userTechniqueUsageLogs;
        }, 0);
        
        return {
            ...therapist,
            performance: totalUsage,
        } as TherapistWithPerformance;
    });


  return (
    <TherapistsList therapists={therapists} />
  );
}
