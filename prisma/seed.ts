import { PrismaClient } from '@prisma/client';
import { mockPatients, mockServices, generateMockAppointments } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data in the correct order to avoid foreign key constraint errors
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.patient.deleteMany();
  console.log('Cleared previous data.');

  // Seed Patients
  const createdPatients = [];
  for (const patientData of mockPatients) {
    const patient = await prisma.patient.create({
      data: patientData,
    });
    createdPatients.push(patient);
  }
  console.log(`Seeded ${createdPatients.length} patients.`);

  // Seed Services
  const createdServices = [];
  for (const serviceData of mockServices) {
    const service = await prisma.service.create({
      data: serviceData,
    });
    createdServices.push(service);
  }
  console.log(`Seeded ${createdServices.length} services.`);

  // Generate and Seed Appointments
  const mockAppointments = generateMockAppointments(createdPatients, createdServices);
  for (const appointmentData of mockAppointments) {
    await prisma.appointment.create({
      data: appointmentData,
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
