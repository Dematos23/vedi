
import * as React from "react";
import { notFound } from "next/navigation";
import { getTherapistPerformance } from "@/lib/actions";
import { TherapistDetailClient } from "./components/therapist-detail-client";
import type { Technique, UserTechniqueStatus } from "@prisma/client";

export type TechniquePerformance = (UserTechniqueStatus & {
    technique: Technique;
    _count: {
        userTechniqueUsageLogs: number;
    };
})

export default async function TherapistDetailPage({ params }: { params: { id:string } }) {
  try {
    const performanceData = await getTherapistPerformance(params.id);
    
    const serializableData = {
      ...performanceData,
      kpis: {
        ...performanceData.kpis,
        totalSales: Number(performanceData.kpis.totalSales),
      },
      recentAppointments: performanceData.recentAppointments.map(appt => ({
        ...appt,
        date: appt.date.toISOString(),
      })),
      techniquesPerformance: performanceData.techniquesPerformance.map(tech => ({
        ...tech,
        createdAt: tech.createdAt.toISOString(),
        updatedAt: tech.updatedAt.toISOString(),
        technique: {
            ...tech.technique,
            createdAt: tech.technique.createdAt.toISOString(),
            updatedAt: tech.technique.updatedAt.toISOString(),
        }
      })),
    }

    return <TherapistDetailClient data={serializableData} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
