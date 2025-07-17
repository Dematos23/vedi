
import { PrismaClient, UserTechniqueStatusType } from '@prisma/client';
import { mockUsers, generateMockPatients, mockServices, mockTechniques, generateMockSalesAndBalances, generateMockAppointments } from '../src/lib/mock-data';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data in the correct order to avoid foreign key constraint errors
  await prisma.userTechniqueUsageLog.deleteMany();
  await prisma.patientServiceUsage.deleteMany();
  await prisma.patientServiceBalance.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.sale.deleteMany();

  // We need to disconnect services from techniques before deleting them
  const services = await prisma.service.findMany();
  for (const service of services) {
    await prisma.service.update({
        where: { id: service.id },
        data: { techniques: { set: [] } }
    });
  }
  
  await prisma.service.deleteMany();
  await prisma.userTechniqueStatus.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.technique.deleteMany();
  await prisma.package.deleteMany();
  console.log('Cleared previous data.');

  // Seed Techniques
  const createdTechniques = [];
  for (const techData of mockTechniques) {
    const technique = await prisma.technique.create({ data: techData });
    createdTechniques.push(technique);
    console.log(`Created technique: ${technique.name}`);
  }

  // Seed Therapists and associate them with techniques
  const createdUsers = [];
  for (const userData of mockUsers) {
    const user = await prisma.user.create({ data: userData });
    createdUsers.push(user);
    console.log(`Created therapist: ${user.name} ${user.lastname}`);

    // Assign 2-4 random techniques to each therapist
    const techniquesToAssign = faker.helpers.arrayElements(createdTechniques, faker.number.int({ min: 2, max: 4 }));
    for (const technique of techniquesToAssign) {
      await prisma.userTechniqueStatus.create({
        data: {
          userId: user.id,
          techniqueId: technique.id,
          status: faker.helpers.arrayElement([UserTechniqueStatusType.PRACTITIONER, UserTechniqueStatusType.THERAPIST]),
        },
      });
    }
    console.log(`- Assigned ${techniquesToAssign.length} techniques to ${user.name}`);
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

    // Get therapist's techniques
    const therapistTechniques = await prisma.userTechniqueStatus.findMany({
      where: { userId: user.id },
      include: { technique: true },
    });
    const therapistTechniqueIds = therapistTechniques.map(ut => ut.techniqueId);

    // Seed Services for the current therapist and associate with techniques
    const createdServices = [];
    const servicesForTherapist = [];
    for (const serviceData of mockServices) {
        // A service is relevant if the therapist has at least one of its required techniques
        const requiredTechniques = faker.helpers.arrayElements(createdTechniques, faker.number.int({ min: 1, max: 2 }));
        
        const service = await prisma.service.create({
            data: {
                ...serviceData,
                userId: user.id,
                techniques: {
                    connect: requiredTechniques.map(t => ({ id: t.id }))
                }
            },
        });
        createdServices.push(service);

        const hasSkill = requiredTechniques.some(rt => therapistTechniqueIds.includes(rt.id));
        if (hasSkill) {
            servicesForTherapist.push({ service, techniques: requiredTechniques });
        }
    }
    console.log(`- Seeded ${createdServices.length} services and linked techniques.`);

    // Generate and Seed Sales and PatientServiceBalances for this therapist's patients
    const mockSales = generateMockSalesAndBalances(createdPatients, createdServices);
    for (const saleData of mockSales) {
      const sale = await prisma.sale.create({
        data: saleData,
      });
      if (sale.serviceId) {
        await prisma.patientServiceBalance.create({
          data: {
            patientId: sale.patientId,
            serviceId: sale.serviceId,
            saleId: sale.id,
            total: 5,
            used: 0,
          },
        });
      }
    }
    console.log(`- Seeded ${mockSales.length} sales and created corresponding service balances.`);
    
    // Generate and Seed Appointments, respecting therapist skills
    const mockAppointments = generateMockAppointments(createdPatients, user.id, servicesForTherapist);
    for (const { appointmentData, techniquesUsed } of mockAppointments) {
      const appt = await prisma.appointment.create({
        data: appointmentData,
      });

      // If the appointment is done, log the technique usage
      if (appt.status === 'DONE' && techniquesUsed.length > 0) {
        const techniqueToLog = faker.helpers.arrayElement(techniquesUsed);
        await prisma.userTechniqueUsageLog.create({
            data: {
                userId: user.id,
                techniqueId: techniqueToLog.id,
                appointmentId: appt.id
            }
        });
      }
    }
    console.log(`- Seeded ${mockAppointments.length} appointments with realistic therapist skills.`);
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
