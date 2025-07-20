
import * as React from "react";
import { notFound } from "next/navigation";
import { getTherapistPerformance } from "@/lib/actions";
import { TherapistDetailClient } from "./components/therapist-detail-client";
import type { Technique, UserTechniqueStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

export type TechniquePerformance = (UserTechniqueStatus & {
    technique: Technique;
    _count: {
        userTechniqueUsageLogs: number;
    };
})

export default async function TherapistDetailPage({ params }: { params: { id:string } }) {
  try {
    const performanceDataPromise = getTherapistPerformance(params.id);
    const allTechniquesPromise = prisma.technique.findMany();

    const [performanceData, allTechniques] = await Promise.all([
        performanceDataPromise,
        allTechniquesPromise
    ]);
    
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

    const serializableTechniques = allTechniques.map(tech => ({
        ...tech,
        createdAt: tech.createdAt.toISOString(),
        updatedAt: tech.updatedAt.toISOString(),
    }));

    return <TherapistDetailClient data={serializableData} allTechniques={serializableTechniques} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

