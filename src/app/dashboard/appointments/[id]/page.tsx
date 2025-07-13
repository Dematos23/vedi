
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Appointment, Patient, Service } from "@prisma/client";
import { AppointmentDetailClient } from "./components/appointment-detail-client";

export type AppointmentWithDetails = Appointment & {
  patient: Patient;
  service: Service;
};

// This is a serializable version of the above type for client components
export type SerializableAppointmentWithDetails = Omit<AppointmentWithDetails, 'date'> & {
  date: string;
};


// This wrapper is now the default export and a true Server Component.
export default async function AppointmentDetailPageWrapper({ params }: { params: { id:string } }) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      service: true,
    },
  });

  if (!appointment) {
    notFound();
  }
  
  // Serialize the date to an ISO string before passing to the client component
  const serializableAppointment: SerializableAppointmentWithDetails = {
    ...appointment,
    date: appointment.date.toISOString(),
  };

  // It fetches the data and passes it to the client component.
  return <AppointmentDetailClient appointmentData={serializableAppointment} />;
}
