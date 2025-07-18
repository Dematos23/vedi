
import { PrismaClient, TechniqueStatus } from '@prisma/client';
import { mockUsers, generateMockPatients, mockServices, mockTechniques, generateMockSalesAndBalances, generateMockAppointments, mockPackages } from '../src/lib/mock-data';
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
  
  // Seed Packages
  for (const pkgData of mockPackages) {
    await prisma.package.create({ data: pkgData });
  }
  console.log(`Seeded ${mockPackages.length} packages.`);


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
          status: faker.helpers.arrayElement([TechniqueStatus.PRACTITIONER, TechniqueStatus.THERAPIST]),
        },
      });
    }
    console.log(`- Assigned ${techniquesToAssign.length} techniques to ${user.name}`);
  }

  // Seed Services globally (not tied to a therapist initially)
  const allCreatedServices = [];
  for (const serviceData of mockServices) {
      const requiredTechniques = faker.helpers.arrayElements(createdTechniques, faker.number.int({ min: 1, max: 2 }));
      const service = await prisma.service.create({
          data: {
              ...serviceData,
              techniques: {
                  connect: requiredTechniques.map(t => ({ id: t.id }))
              }
          },
      });
      allCreatedServices.push(service);
  }
  console.log(`\nSeeded ${allCreatedServices.length} global services and linked techniques.`);


  // Loop through each therapist to create their own patient-related data
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

    // Generate and Seed Sales and PatientServiceBalances for this therapist's patients
    const mockSales = generateMockSalesAndBalances(createdPatients, allCreatedServices);
    for (const saleData of mockSales) {
      if (!saleData.serviceId) continue;
      
      const sale = await prisma.sale.create({
        data: saleData,
      });

      // Create a corresponding service balance for every sale
      await prisma.patientServiceBalance.create({
        data: {
          patientId: sale.patientId,
          serviceId: sale.serviceId,
          saleId: sale.id,
          total: 5, // Each sale corresponds to a package of 5 sessions
          used: 0,
        },
      });
    }
    console.log(`- Seeded ${mockSales.length} sales and created corresponding service balances.`);
    
    // Get therapist's techniques to determine which services they can offer
    const therapistTechniqueIds = (await prisma.userTechniqueStatus.findMany({
      where: { userId: user.id },
    })).map(ut => ut.techniqueId);

    const servicesForTherapist = await prisma.service.findMany({
        where: { techniques: { some: { id: { in: therapistTechniqueIds } } } },
        include: { techniques: true }
    });

    let totalAppointments = 0;
    // Generate and Seed Appointments, respecting therapist skills
    for(const patient of createdPatients) {
        const mockAppointments = generateMockAppointments(patient, servicesForTherapist);
        totalAppointments += mockAppointments.length;

        for (const { appointmentData, techniquesUsed, service } of mockAppointments) {
            const appt = await prisma.appointment.create({
                data: {
                    ...appointmentData,
                    patients: {
                        connect: [{ id: patient.id }]
                    }
                },
            });

            // If the appointment is done, log the technique usage and update balance
            if (appt.status === 'DONE') {
                // Log technique usage
                if (techniquesUsed.length > 0) {
                    const techniqueToLog = faker.helpers.arrayElement(techniquesUsed);
                    await prisma.userTechniqueUsageLog.create({
                        data: {
                            userId: user.id,
                            techniqueId: techniqueToLog.id,
                            appointmentId: appt.id
                        }
                    });
                }
                
                // Update service balance
                const serviceBalance = await prisma.patientServiceBalance.findFirst({
                    where: {
                        patientId: patient.id,
                        serviceId: service.id,
                        used: { lt: prisma.patientServiceBalance.fields.total }
                    },
                    orderBy: { createdAt: 'asc' }
                });

                if (serviceBalance) {
                   const updatedBalance = await prisma.patientServiceBalance.update({
                        where: { id: serviceBalance.id },
                        data: { used: { increment: 1 } }
                    });
                    await prisma.patientServiceUsage.create({
                        data: {
                            appointmentId: appt.id,
                            balanceId: updatedBalance.id,
                            quantity: 1
                        }
                    });
                }
            }
        }
    }
    console.log(`- Seeded ${totalAppointments} appointments with realistic therapist skills and updated balances.`);
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
