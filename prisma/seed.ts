
import { PrismaClient } from '@prisma/client';
import { mockUsers, generateMockPatients, mockServices, generateMockSalesAndBalances, generateMockAppointments } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data in the correct order to avoid foreign key constraint errors
  await prisma.userTechniqueUsageLog.deleteMany();
  await prisma.patientServiceUsage.deleteMany();
  await prisma.patientServiceBalance.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.service.deleteMany();
  await prisma.userTechnique.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.technique.deleteMany();
  await prisma.package.deleteMany();
  console.log('Cleared previous data.');

  // Seed Therapists
  const createdUsers = [];
  for (const userData of mockUsers) {
    const user = await prisma.user.create({ data: userData });
    createdUsers.push(user);
    console.log(`Created therapist: ${user.name} ${user.lastname}`);
  }

  // Loop through each therapist to create their own data
  for (const user of createdUsers) {
    console.log(`\nSeeding data for ${user.name} ${user.lastname}...`);

    // Seed 10 Patients for the current therapist
    const mockPatients = generateMockPatients(10);
    const createdPatients = [];
    for (const patientData of mockPatients) {
      const patient = await prisma.patient.create({
        data: {
          ...patientData,
          userId: user.id,
        },
      });
      createdPatients.push(patient);
    }
    console.log(`- Seeded ${createdPatients.length} patients.`);

    // Seed Services for the current therapist
    const createdServices = [];
    for (const serviceData of mockServices) {
      const service = await prisma.service.create({
        data: {
          ...serviceData,
          userId: user.id,
        },
      });
      createdServices.push(service);
    }
    console.log(`- Seeded ${createdServices.length} services.`);

    // Generate and Seed Sales and PatientServiceBalances for this therapist's patients
    const mockSales = generateMockSalesAndBalances(createdPatients, createdServices);
    for (const saleData of mockSales) {
      const sale = await prisma.sale.create({
        data: saleData,
      });
      // Create a corresponding service balance for the sale
      if (sale.serviceId) {
        await prisma.patientServiceBalance.create({
          data: {
            patientId: sale.patientId,
            serviceId: sale.serviceId,
            saleId: sale.id,
            total: 5, // All mock sales are for 5 sessions
            used: 0,
          },
        });
      }
    }
    console.log(`- Seeded ${mockSales.length} sales and created corresponding service balances.`);
    
    // Generate and Seed Appointments for this therapist's patients
    const mockAppointments = generateMockAppointments(createdPatients, createdServices);
    for (const apptData of mockAppointments) {
      await prisma.appointment.create({
        data: apptData,
      });
    }
    console.log(`- Seeded ${mockAppointments.length} appointments.`);
  }

  console.log(`\nSeeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
