
"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import * as z from "zod";
import type { ServiceStatus } from "@prisma/client";

// Service Actions
const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
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
      // status defaults to ACTIVE
    },
  });

  revalidatePath("/dashboard/services");
}

export async function updateService(data: z.infer<typeof serviceSchema>) {
    const validatedFields = serviceSchema.safeParse(data);

    if (!validatedFields.success || !validatedFields.data.id) {
        throw new Error("Invalid service data.");
    }

    const { id, ...serviceData } = validatedFields.data;

    await prisma.service.update({
        where: { id },
        data: serviceData,
    });

    revalidatePath("/dashboard/services");
}

export async function deleteService(serviceId: string) {
    if (!serviceId) {
        throw new Error("Service ID is required.");
    }
    
    const appointmentCount = await prisma.appointment.count({
        where: { serviceId },
    });

    if (appointmentCount > 0) {
        throw new Error("This service has appointments and cannot be deleted.");
    }

    await prisma.service.delete({
        where: { id: serviceId },
    });

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard/appointments");
}


export async function toggleServiceStatus(serviceId: string, status: ServiceStatus) {
    if (!serviceId) {
        throw new Error("Service ID is required.");
    }

    await prisma.service.update({
        where: { id: serviceId },
        data: { status },
    });

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard/appointments");
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
  
  const service = await prisma.service.findUnique({
      where: { id: validatedFields.data.serviceId }
  });

  if (!service || service.status === 'INACTIVE') {
      throw new Error("Cannot book an appointment for an inactive service.");
  }

  await prisma.appointment.create({
    data: {
      ...validatedFields.data,
    },
  });

  revalidatePath("/dashboard/appointments");
}

export async function updateAppointmentDescription(appointmentId: string, description: string) {
    if (!appointmentId) {
        throw new Error("Appointment ID is required.");
    }

    const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { description },
        include: {
          patient: true,
          service: true,
        }
    });

    revalidatePath(`/dashboard/appointments`);
    revalidatePath(`/dashboard/appointments/${appointmentId}`);
    
    return updatedAppointment;
}


// Patient Actions
const patientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    lastname: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export async function createPatient(data: z.infer<typeof patientSchema>) {
    const validatedFields = patientSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid patient data.");
    }

    await prisma.patient.create({
        data: validatedFields.data,
    });

    revalidatePath("/dashboard/patients");
}


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

// Chart Actions
const chartDataSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    timeUnit: z.enum(["day", "week", "month", "year"]),
    model: z.enum(["appointment"]),
    serviceIds: z.array(z.string()).optional(),
    aggregateBy: z.enum(["sum", "count"]).default("sum"),
});

export async function getChartData(input: z.infer<typeof chartDataSchema>) {
    const { startDate, endDate, timeUnit, serviceIds, aggregateBy } = chartDataSchema.parse(input);

    const where: any = {
        date: {
            gte: startDate,
            lte: endDate,
        },
    };

    if (serviceIds && serviceIds.length > 0) {
        where.serviceId = { in: serviceIds };
    }
    
    // Determine the date truncation unit based on the database
    const dateTrunc = `DATE_TRUNC('${timeUnit}', "date")`;
    
    const aggregationField = aggregateBy === 'sum' 
      ? `SUM(s.price)` // Sum of service price
      : `COUNT(a.id)`; // Count of appointments
    
    const rawQuery = `
      SELECT
        ${dateTrunc} AS "date",
        ${aggregationField} AS "total"
      FROM "Appointment" AS a
      ${aggregateBy === 'sum' ? 'JOIN "Service" AS s ON a."serviceId" = s.id' : ''}
      WHERE a.date >= $1 AND a.date <= $2
      ${serviceIds && serviceIds.length > 0 ? `AND a."serviceId" IN (${serviceIds.map(id => `'${id}'`).join(',')})` : ''}
      GROUP BY 1
      ORDER BY 1 ASC;
    `;

    try {
        const result = await prisma.$queryRawUnsafe(rawQuery, startDate, endDate);
        return result as { date: Date, total: number | bigint }[];
    } catch (error) {
        console.error("Failed to fetch chart data:", error);
        throw new Error("Could not fetch chart data.");
    }
}
