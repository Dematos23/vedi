
import * as React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Service, Appointment, Patient, Technique } from "@prisma/client";
import { ServiceDetailClient } from "./components/service-detail-client";

export type ServiceWithDetails = Service & {
  techniques: Technique[];
  appointments: (Appointment & {
    patients: Patient[];
  })[];
};

export type SerializableAppointment = Omit<Appointment, 'date'> & { date: string };
export type SerializablePatient = Patient;
export type SerializableTechnique = Omit<Technique, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string };
export type SerializableServiceWithDetails = Omit<ServiceWithDetails, 'price' | 'appointments' | 'techniques'> & {
  price: number;
  techniques: SerializableTechnique[];
  appointments: (SerializableAppointment & {
    patients: SerializablePatient[];
  })[];
};

export default async function ServiceDetailPage({ params }: { params: { id:string } }) {
  const servicePromise = prisma.service.findUnique({
    where: { id: params.id },
    include: {
      techniques: true,
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
  
  const techniquesPromise = prisma.technique.findMany();

  const [service, allTechniques] = await Promise.all([servicePromise, techniquesPromise]);

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
    techniques: service.techniques.map(tech => ({
        ...tech,
        createdAt: tech.createdAt.toISOString(),
        updatedAt: tech.updatedAt.toISOString(),
    }))
  };

  const serializableTechniques = allTechniques.map(tech => ({
      ...tech,
      createdAt: tech.createdAt.toISOString(),
      updatedAt: tech.updatedAt.toISOString(),
  }));

  return <ServiceDetailClient serviceData={serializableService} allTechniques={serializableTechniques} />;
}
