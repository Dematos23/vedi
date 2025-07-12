
"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import * as z from "zod";

// Service Actions
const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  duration: z.coerce.number().int().positive("Duration must be a positive number."),
});

export async function createService(data: z.infer<typeof serviceSchema>) {
  const validatedFields = serviceSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid service data.");
  }

  await prisma.service.create({
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      price: validatedFields.data.price,
      duration: validatedFields.data.duration,
    },
  });

  revalidatePath("/dashboard/services");
}

// Appointment Actions
const appointmentSchema = z.object({
  patientId: z.string(),
  serviceId: z.string(),
  date: z.date(),
  description: z.string().optional(),
});

export async function createAppointment(
  data: z.infer<typeof appointmentSchema>
) {
  const validatedFields = appointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid appointment data.");
  }

  await prisma.appointment.create({
    data: {
      ...validatedFields.data,
    },
  });

  revalidatePath("/dashboard/appointments");
}


// Patient Actions
export async function updatePatientNotes(patientId: string, notes: string) {
    if (!patientId) {
        throw new Error("Patient ID is required.");
    }

    await prisma.patient.update({
        where: { id: patientId },
        data: { notes },
    });

    revalidatePath(`/dashboard/patients/${patientId}`);
}
