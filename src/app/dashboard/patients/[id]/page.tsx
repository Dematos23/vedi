
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Patient, Appointment, Service } from "@prisma/client";
import { PatientDetailClient } from "./components/patient-detail-client";


export type PatientWithAppointments = Patient & {
  appointments: (Appointment & {
    service: Service;
  })[];
};

// This wrapper is now the default export and a true Server Component.
export default async function PatientDetailPageWrapper({ params }: { params: { id:string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      appointments: {
        include: {
          service: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: 10,
      },
    },
  });

  if (!patient) {
    notFound();
  }

  // It fetches the data and passes it to the client component.
  return <PatientDetailClient patient={patient} />;
}
