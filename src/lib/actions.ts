
"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import * as z from "zod";
import { AppointmentStatus, Concurrency, type ServiceStatus, UserType, AppointmentEvaluation, TechniqueStatus } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";

// Service Actions
const createServiceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
  techniqueIds: z.array(z.string()).min(1, "Please select at least one technique."),
});


export async function createService(data: z.infer<typeof createServiceSchema>) {
  const validatedFields = createServiceSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid service data.");
  }
  
  const { techniqueIds, ...serviceData } = validatedFields.data;

  // Since a therapist is now required, we'll assign it to the first available one.
  // In a real multi-user app, this would come from the logged-in user's session.
  const therapist = await prisma.user.findFirst({
      where: { type: UserType.THERAPIST }
  });

  if (!therapist) {
      throw new Error("No therapist available to assign this service to.");
  }

  await prisma.service.create({
    data: {
      ...serviceData,
      userId: therapist.id,
      status: 'ACTIVE',
      techniques: {
        connect: techniqueIds.map(id => ({ id })),
      }
    },
  });

  revalidatePath("/services");
}

const updateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
  techniqueIds: z.array(z.string()).min(1, "Please select at least one technique."),
});


export async function updateService(data: z.infer<typeof updateServiceSchema>) {
    const validatedFields = updateServiceSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid service data for update.");
    }

    const { id, techniqueIds, ...serviceData } = validatedFields.data;

    await prisma.service.update({
        where: { id },
        data: {
          ...serviceData,
          techniques: {
            set: techniqueIds.map(techId => ({ id: techId })),
          }
        },
    });

    revalidatePath("/services");
    revalidatePath(`/services/${id}`);
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
    
    // Also need to check for patient service balances and sales
    const balanceCount = await prisma.patientServiceBalance.count({ where: { serviceId } });
    if (balanceCount > 0) {
        throw new Error("This service has patient balances and cannot be deleted.");
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
    revalidatePath(`/services/${serviceId}`);
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
    const serviceBalance = await tx.patientServiceBalance.findFirst({
      where: {
        patientId: patientId,
        serviceId: appointment.serviceId,
        used: {
          lt: tx.patientServiceBalance.fields.total,
        },
      },
      orderBy: {
        createdAt: 'asc',
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
        quantity: 1, 
      },
    });

    // 5. Update the appointment status to 'DONE' and evaluation to 'UNDER_EVALUATION'
    const completedAppointment = await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.DONE,
        evaluation: AppointmentEvaluation.UNDER_EVALUATION,
      },
    });
    
    revalidatePath(`/appointments`);
    revalidatePath(`/appointments/${appointmentId}`);
    revalidatePath(`/patients/${patientId}`);

    return completedAppointment;
  });
}

export async function evaluateAppointment(appointmentId: string, evaluation: AppointmentEvaluation) {
  if (!appointmentId) {
    throw new Error("Appointment ID is required.");
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { evaluation },
  });

  revalidatePath(`/appointments`);
  revalidatePath(`/appointments/${appointmentId}`);

  return updatedAppointment;
}


// Patient Actions
const createPatientSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    secondname: z.string().optional(),
    lastname: z.string().min(2, "Last name must be at least 2 characters."),
    secondlastname: z.string().optional(),
    email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export async function createPatient(data: z.infer<typeof createPatientSchema>) {
    const validatedFields = createPatientSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid patient data.");
    }

    const therapist = await prisma.user.findFirst({ where: { type: UserType.THERAPIST }});

    await prisma.patient.create({
        data: {
            ...validatedFields.data,
            userId: therapist?.id,
        },
    });

    revalidatePath("/patients");
}

const updatePatientSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  secondname: z.string().optional(),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  secondlastname: z.string().optional(),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});


export async function updatePatient(data: z.infer<typeof updatePatientSchema>) {
    const validatedFields = updatePatientSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid patient data.");
    }
    
    const { id, ...patientData } = validatedFields.data;

    await prisma.patient.update({
        where: { id },
        data: patientData,
    });

    revalidatePath(`/patients/${id}`);
    revalidatePath('/patients');
}


// Chart Actions
const chartDataSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    timeUnit: z.enum(["day", "week", "month", "year"]),
    model: z.enum(["sale"]),
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
    
    const aggregationField = aggregateBy === 'sum' 
      ? `SUM(s.amount)`
      : `COUNT(s.id)`;
    
    let queryParams: (Date | string)[] = [startDate, endDate];
    let serviceIdFilter = '';

    if (serviceIds && serviceIds.length > 0) {
        serviceIdFilter = `AND s."serviceId" IN (${serviceIds.map((_, i) => `$${i + 3}`).join(',')})`;
        queryParams.push(...serviceIds);
    }
    
    const rawQuery = `
      SELECT
        ${dateTrunc} AS "date",
        ${aggregationField} AS "total"
      FROM "Sale" AS s
      WHERE s.date >= $1 AND s.date <= $2
      ${serviceIdFilter}
      GROUP BY 1
      ORDER BY 1 ASC;
    `;

    try {
        const result: { date: Date, total: number | bigint | object }[] = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);
        
        return result.map(item => ({
            ...item,
            total: Number(item.total)
        }));

    } catch (error) {
        console.error("Failed to fetch chart data:", error);
        throw new Error("Could not fetch chart data.");
    }
}


// Therapist Actions
const createTherapistSchema = z.object({
  name: z.string().min(2, "Name is required."),
  lastname: z.string().min(2, "Last name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
});

function generatePassword() {
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  const vowels = 'AEIOU';
  const numbers = '0123456789';
  const symbols = '+*,.!-_/=';
  const randomChar = (str: string) => str.charAt(Math.floor(Math.random() * str.length));
  return [
    randomChar(consonants),
    randomChar(vowels).toLowerCase(),
    randomChar(consonants).toLowerCase(),
    randomChar(vowels).toLowerCase(),
    randomChar(consonants).toLowerCase(),
    randomChar(numbers),
    randomChar(numbers),
    randomChar(symbols)
  ].join('');
}

export async function createTherapist(data: z.infer<typeof createTherapistSchema>) {
    const validatedFields = createTherapistSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error("Invalid therapist data.");
    }
    
    const { name, lastname, email, phone } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const newPassword = generatePassword();
    
    const newUser = await prisma.user.create({
        data: {
            name,
            lastname,
            email,
            phone,
            password: newPassword, // In a real app, this MUST be hashed
            type: UserType.THERAPIST,
        }
    });

    revalidatePath("/therapists");
    
    return {
        user: newUser,
        newPassword: newPassword,
    };
}


export async function getTherapistPerformance(therapistId: string) {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  const therapist = await prisma.user.findUnique({
    where: { id: therapistId },
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      phone: true,
      type: true,
    },
  });

  if (!therapist || therapist.type !== UserType.THERAPIST) {
    throw new Error('Therapist not found.');
  }
  
  const assignedPatients = await prisma.patient.findMany({
    where: { userId: therapistId },
    select: { id: true, name: true, lastname: true, secondname: true, secondlastname: true, email: true },
    orderBy: { createdAt: 'desc' },
  });

  const appointmentsThisMonth = await prisma.appointment.count({
    where: {
      patients: {
        some: {
          id: { in: assignedPatients.map(p => p.id) }
        }
      },
      date: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    }
  });
  
  const recentAppointments = await prisma.appointment.findMany({
      where: {
          patients: {
            some: {
                id: { in: assignedPatients.map(p => p.id) }
            }
          }
      },
      include: {
          patients: true,
          service: true,
      },
      orderBy: {
          date: 'desc'
      },
      take: 10
  });

  const totalSales = await prisma.sale.aggregate({
    where: {
      patientId: { in: assignedPatients.map(p => p.id) }
    },
    _sum: {
      amount: true,
    }
  });

  const userTechniqueStatuses = await prisma.userTechniqueStatus.findMany({
    where: { userId: therapistId },
    include: {
        technique: true,
    }
  });

  const techniquesPerformance = await Promise.all(
    userTechniqueStatuses.map(async (userTechniqueStatus) => {
        const usageCount = await prisma.userTechniqueUsageLog.count({
            where: {
                userId: therapistId,
                techniqueId: userTechniqueStatus.techniqueId,
            },
        });

        return {
            ...userTechniqueStatus,
            _count: {
                userTechniqueUsageLogs: usageCount,
            },
        };
    })
  );


  return {
    ...therapist,
    assignedPatients,
    recentAppointments,
    techniquesPerformance,
    kpis: {
      totalPatients: assignedPatients.length,
      appointmentsThisMonth,
      totalSales: totalSales._sum.amount || 0,
    }
  };
}

export async function resetTherapistPassword(therapistId: string) {
  if (!therapistId) {
    throw new Error("Therapist ID is required.");
  }

  const newPassword = generatePassword();

  await prisma.user.update({
    where: { id: therapistId },
    data: {
      password: newPassword, // This should be hashed in a real application
    },
  });

  revalidatePath(`/therapists/${therapistId}`);

  return { newPassword };
}


// Technique Actions
const createTechniqueSchema = z.object({
  name: z.string().min(3, "Technique name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  requiredSessionsForTherapist: z.coerce.number().int().positive("Required sessions must be a positive integer."),
  url: z.string().url("Please enter a valid URL."),
});

const techniqueUpdateSchema = createTechniqueSchema.extend({
  id: z.string(),
});


export async function createTechnique(data: z.infer<typeof createTechniqueSchema>) {
  const validatedFields = createTechniqueSchema.safeParse(data);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Invalid technique data: ${errorMessages}`);
  }

  await prisma.technique.create({
    data: validatedFields.data,
  });

  revalidatePath("/techniques");
}

export async function updateTechnique(data: z.infer<typeof techniqueUpdateSchema>) {
    const validatedFields = techniqueUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid technique data.");
    }

    const { id, ...techniqueData } = validatedFields.data;

    await prisma.technique.update({
        where: { id },
        data: techniqueData,
    });

    revalidatePath("/techniques");
    revalidatePath(`/techniques/${id}`);
}

export async function deleteTechnique(techniqueId: string) {
    if (!techniqueId) {
        throw new Error("Technique ID is required.");
    }

    const serviceCount = await prisma.service.count({
        where: { techniques: { some: { id: techniqueId } } },
    });

    if (serviceCount > 0) {
        throw new Error("This technique is associated with services and cannot be deleted.");
    }

    // Also need to check for user technique statuses
    const statusCount = await prisma.userTechniqueStatus.count({ where: { techniqueId } });
    if (statusCount > 0) {
        throw new Error("This technique is assigned to therapists and cannot be deleted.");
    }

    await prisma.technique.delete({
        where: { id: techniqueId },
    });

    revalidatePath("/techniques");
}

export async function assignTherapistsToTechnique(techniqueId: string, therapistIds: string[]) {
    if (!techniqueId) {
        throw new Error("Technique ID is required.");
    }
    if (!therapistIds || therapistIds.length === 0) {
        throw new Error("At least one therapist ID is required.");
    }

    const dataToInsert = therapistIds.map(userId => ({
        userId,
        techniqueId,
        status: TechniqueStatus.PRACTITIONER, 
    }));
    
    // This will create multiple records in one go.
    await prisma.userTechniqueStatus.createMany({
        data: dataToInsert,
        skipDuplicates: true, // This prevents errors if a therapist is already assigned.
    });

    revalidatePath(`/techniques/${techniqueId}`);
}

export async function assignTechniquesToTherapist(therapistId: string, techniqueIds: string[]) {
    if (!therapistId) {
        throw new Error("Therapist ID is required.");
    }
    
    await prisma.$transaction(async (tx) => {
        // First, remove all existing assignments for this therapist
        await tx.userTechniqueStatus.deleteMany({
            where: {
                userId: therapistId,
            }
        });

        // Then, create the new assignments
        if (techniqueIds.length > 0) {
            const dataToInsert = techniqueIds.map(techniqueId => ({
                userId: therapistId,
                techniqueId: techniqueId,
                status: TechniqueStatus.PRACTITIONER, 
            }));

            await tx.userTechniqueStatus.createMany({
                data: dataToInsert,
            });
        }
    });

    revalidatePath(`/therapists/${therapistId}`);
}

// Sale Actions
const createSaleSchema = z.object({
  patientId: z.string({ required_error: "Patient is required." }),
  saleType: z.enum(["service", "package"]),
  serviceId: z.string().optional(),
  packageId: z.string().optional(),
  sessions: z.coerce.number().int().positive().optional(),
  amount: z.coerce.number().positive("Amount must be a positive number."),
}).refine(data => {
    if (data.saleType === 'service') return !!data.serviceId && !!data.sessions;
    if (data.saleType === 'package') return !!data.packageId;
    return false;
}, {
    message: "Invalid sale data based on sale type.",
});

export async function createSale(data: z.infer<typeof createSaleSchema>) {
    const validatedFields = createSaleSchema.safeParse(data);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        console.error(errors);
        throw new Error("Invalid sale data.");
    }
    
    const { patientId, saleType, serviceId, packageId, sessions, amount } = validatedFields.data;

    return await prisma.$transaction(async (tx) => {
        const sale = await tx.sale.create({
            data: {
                patientId,
                serviceId: saleType === 'service' ? serviceId : undefined,
                packageId: saleType === 'package' ? packageId : undefined,
                amount,
                date: new Date(),
            }
        });

        if (saleType === 'service' && serviceId && sessions) {
            await tx.patientServiceBalance.create({
                data: {
                    patientId,
                    serviceId,
                    saleId: sale.id,
                    total: sessions,
                    used: 0,
                }
            });
        }
        
        revalidatePath("/sales");
        revalidatePath(`/patients/${patientId}`);

        return sale;
    });
}

// Package Actions
const createPackageSchema = z.object({
  name: z.string().min(3, "Package name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  serviceIds: z.array(z.string()).min(1, "Please select at least one service."),
});

export async function createPackage(data: z.infer<typeof createPackageSchema>) {
  const validatedFields = createPackageSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid package data.");
  }
  
  const { serviceIds, ...packageData } = validatedFields.data;

  await prisma.package.create({
    data: {
      ...packageData,
      services: {
        connect: serviceIds.map(id => ({ id })),
      }
    },
  });

  revalidatePath("/packages");
}
