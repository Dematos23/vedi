
import * as React from "react";
import { notFound } from "next/navigation";
import { getTherapistPerformance } from "@/lib/actions";
import { TherapistDetailClient } from "./components/therapist-detail-client";

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
    }

    return <TherapistDetailClient data={serializableData} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
