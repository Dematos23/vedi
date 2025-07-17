
"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import * as z from "zod";
import { AppointmentStatus, Concurrency, type ServiceStatus } from "@prisma/client";

// Service Actions
const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
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
      status: 'ACTIVE',
    },
  });

  revalidatePath("/services");
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

    revalidatePath("/services");
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

    revalidatePath("/services");
    revalidatePath("/appointments");
}


export async function toggleServiceStatus(serviceId: string, status: ServiceStatus) {
    if (!serviceId) {
        throw new Error("Service ID is required.");
    }

    await prisma.service.update({
        where: { id: serviceId },
        data: { status },
    });
    
    revalidatePath("/services");
    revalidatePath("/appointments");
}


// Appointment Actions
const appointmentSchema = z.object({
  patientIds: z.array(z.string()).min(1, "At least one patient is required."),
  serviceId: z.string(),
  date: z.date(),
  concurrency: z.nativeEnum(Concurrency),
  description: z.string().optional(),
});

export async function createAppointment(
  data: z.infer<typeof appointmentSchema>
) {
  const validatedFields = appointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    throw new Error("Invalid appointment data.");
  }

  const { patientIds, ...restOfData } = validatedFields.data;
  
  const service = await prisma.service.findUnique({
      where: { id: restOfData.serviceId }
  });

  if (!service || service.status === 'INACTIVE') {
      throw new Error("Cannot book an appointment for an inactive service.");
  }

  await prisma.appointment.create({
    data: {
      ...restOfData,
      description: restOfData.description || '',
      patients: {
        connect: patientIds.map(id => ({ id }))
      }
    },
  });

  revalidatePath("/appointments");
}

export async function updateAppointmentDescription(appointmentId: string, description: string) {
    if (!appointmentId) {
        throw new Error("Appointment ID is required.");
    }

    const updatedAppointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { description },
        include: {
          patients: true,
          service: true,
        }
    });

    revalidatePath(`/appointments`);
    revalidatePath(`/appointments/${appointmentId}`);
    
    return updatedAppointment;
}

export async function completeAppointment(appointmentId: string, patientId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find the appointment and related service
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true },
    });

    if (!appointment || !appointment.service) {
      throw new Error("Appointment or associated service not found.");
    }
    
    if (appointment.status === 'DONE') {
      throw new Error("Appointment is already completed.");
    }

    // 2. Find the patient's service balance for this service
    // This assumes the patient has a balance from a sale.
    // In a real app, you might need more complex logic to find the right balance.
    const serviceBalance = await tx.patientServiceBalance.findFirst({
      where: {
        patientId: patientId,
        serviceId: appointment.serviceId,
        used: {
          lt: prisma.patientServiceBalance.fields.total, // Ensure there are remaining sessions
        },
      },
      orderBy: {
        createdAt: 'asc', // Use the oldest balance first
      },
    });

    if (!serviceBalance) {
      throw new Error("No available service balance found for this patient and service.");
    }

    // 3. Increment the 'used' count on the balance
    const updatedBalance = await tx.patientServiceBalance.update({
      where: { id: serviceBalance.id },
      data: { used: { increment: 1 } },
    });

    // 4. Create a usage log record
    await tx.patientServiceUsage.create({
      data: {
        appointmentId: appointment.id,
        balanceId: updatedBalance.id,
        quantity: 1, // Consuming one session
      },
    });

    // 5. Update the appointment status to 'DONE'
    const completedAppointment = await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.DONE },
    });
    
    // Potentially create UserTechniqueUsageLog here if techniques are used in the appointment
    // This part is omitted for simplicity but would be added here.

    revalidatePath(`/appointments`);
    revalidatePath(`/appointments/${appointmentId}`);
    revalidatePath(`/patients/${patientId}`);

    return completedAppointment;
  });
}


// Patient Actions
const patientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    secondname: z.string().optional(),
    lastname: z.string().min(2, "Last name must be at least 2 characters."),
    secondlastname: z.string().optional(),
    email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
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

    revalidatePath("/patients");
}


export async function updatePatientNotes(patientId: string, notes: string) {
    if (!patientId) {
        throw new Error("Patient ID is required.");
    }

    await prisma.patient.update({
        where: { id: patientId },
        data: { notes },
    });

    revalidatePath(`/patients/${patientId}`);
}

// Chart Actions
const chartDataSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    timeUnit: z.enum(["day", "week", "month", "year"]),
    model: z.enum(["sale"]), // Changed from appointment to sale
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
    
    const dateTrunc = `DATE_TRUNC('${timeUnit}', "date")`;
    
    // Aggregate on the Sale model now
    const aggregationField = aggregateBy === 'sum' 
      ? `SUM(s.amount)` // Sum of sale amount
      : `COUNT(s.id)`; // Count of sales
    
    const rawQuery = `
      SELECT
        ${dateTrunc} AS "date",
        ${aggregationField} AS "total"
      FROM "Sale" AS s
      WHERE s.date >= $1 AND s.date <= $2
      ${serviceIds && serviceIds.length > 0 ? `AND s."serviceId" IN (${serviceIds.map(id => `'${id}'`).join(',')})` : ''}
      GROUP BY 1
      ORDER BY 1 ASC;
    `;

    try {
        const result: { date: Date, total: number | bigint | object }[] = await prisma.$queryRawUnsafe(rawQuery, startDate, endDate);
        
        return result.map(item => ({
            ...item,
            total: Number(item.total)
        }));

    } catch (error) {
        console.error("Failed to fetch chart data:", error);
        throw new Error("Could not fetch chart data.");
    }
}
