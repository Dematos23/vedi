
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Service, Appointment, Patient } from "@prisma/client";
import { ServiceDetailClient } from "./components/service-detail-client";

export type ServiceWithDetails = Service & {
  appointments: (Appointment & {
    patients: Patient[];
  })[];
};

export type SerializableAppointment = Omit<Appointment, 'date'> & { date: string };
export type SerializablePatient = Patient;
export type SerializableServiceWithDetails = Omit<ServiceWithDetails, 'price' | 'appointments'> & {
  price: number;
  appointments: (SerializableAppointment & {
    patients: SerializablePatient[];
  })[];
};

export default async function ServiceDetailPage({ params }: { params: { id:string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: {
      appointments: {
        include: {
          patients: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: 10,
      },
    },
  });

  if (!service) {
    notFound();
  }
  
  const serializableService: SerializableServiceWithDetails = {
    ...service,
    price: Number(service.price),
    appointments: service.appointments.map(appt => ({
        ...appt,
        date: appt.date.toISOString(),
    })),
  };

  return <ServiceDetailClient serviceData={serializableService} />;
}
