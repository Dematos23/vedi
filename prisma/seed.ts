import { PrismaClient } from '@prisma/client';
import { mockPatients, mockServices, mockAppointments } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data in the correct order to avoid foreign key constraint errors
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.patient.deleteMany();
  console.log('Cleared previous data.');

  // Seed Patients
  for (const patient of mockPatients) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        name: patient.name,
        lastname: patient.lastname,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        notes: patient.notes,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
    });
  }
  console.log(`Seeded ${mockPatients.length} patients.`);

  // Seed Services
  for (const service of mockServices) {
    await prisma.service.create({
      data: {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
    });
  }
  console.log(`Seeded ${mockServices.length} services.`);

  // Seed Appointments
  for (const appointment of mockAppointments) {
    await prisma.appointment.create({
      data: {
        id: appointment.id,
        date: appointment.date,
        description: appointment.description,
        patientId: appointment.patientId,
        serviceId: appointment.serviceId,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  }
  console.log(`Seeded ${mockAppointments.length} appointments.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
