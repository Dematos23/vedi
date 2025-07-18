
import { PrismaClient, TechniqueStatus, AppointmentEvaluation } from '@prisma/client';
import { mockUsers, generateMockPatients, mockServices, mockTechniques, generateMockSalesAndBalances, generateMockAppointments, mockPackages } from '../src/lib/mock-data';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Clear existing data in the correct order
  await prisma.userTechniqueUsageLog.deleteMany();
  await prisma.patientServiceUsage.deleteMany();
  await prisma.patientServiceBalance.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.sale.deleteMany();
  const servicesToDisconnect = await prisma.service.findMany({ include: { techniques: true } });
  for (const service of servicesToDisconnect) {
    if (service.techniques.length > 0) {
      await prisma.service.update({
        where: { id: service.id },
        data: { techniques: { set: [] } }
      });
    }
  }
  await prisma.service.deleteMany();
  await prisma.userTechniqueStatus.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.technique.deleteMany();
  await prisma.package.deleteMany();
  console.log('Cleared previous data.');

  // 2. Seed core data
  const createdTechniques = [];
  for (const techData of mockTechniques) {
    const technique = await prisma.technique.create({ data: techData });
    createdTechniques.push(technique);
  }
  console.log(`Seeded ${createdTechniques.length} techniques.`);

  for (const pkgData of mockPackages) {
    await prisma.package.create({ data: pkgData });
  }
  console.log(`Seeded ${mockPackages.length} packages.`);

  const createdUsers = [];
  for (const userData of mockUsers) {
    const user = await prisma.user.create({ data: userData });
    createdUsers.push(user);
  }
  console.log(`Seeded ${createdUsers.length} users (therapists).`);

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
          include: { techniques: true }
      });
      allCreatedServices.push(service);
  }
  console.log(`Seeded ${allCreatedServices.length} global services and linked techniques.`);

  // 3. Assign all techniques to all therapists initially as PRACTITIONER
  for (const user of createdUsers) {
      for (const technique of createdTechniques) {
          await prisma.userTechniqueStatus.create({
              data: {
                  userId: user.id,
                  techniqueId: technique.id,
                  status: TechniqueStatus.PRACTITIONER,
              },
          });
      }
  }
  console.log(`Assigned all techniques to all therapists as PRACTITIONER.`);

  // 4. Generate patient-specific data and appointments
  for (const user of createdUsers) {
    console.log(`\nSeeding data for ${user.name} ${user.lastname}...`);

    const mockPatients = generateMockPatients(10);
    const createdPatients = [];
    for (const patientData of mockPatients) {
      const patient = await prisma.patient.create({
        data: { ...patientData, userId: user.id },
      });
      createdPatients.push(patient);
    }
    console.log(`- Seeded ${createdPatients.length} patients.`);

    const mockSales = generateMockSalesAndBalances(createdPatients, allCreatedServices);
    for (const saleData of mockSales) {
      if (!saleData.serviceId) continue;
      const sale = await prisma.sale.create({ data: saleData });
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
    console.log(`- Seeded ${mockSales.length} sales and created corresponding service balances.`);
    
    let totalAppointments = 0;
    for(const patient of createdPatients) {
        const mockAppointments = generateMockAppointments(patient, allCreatedServices);
        totalAppointments += mockAppointments.length;

        for (const { appointmentData, techniquesUsed, service } of mockAppointments) {
            const appt = await prisma.appointment.create({
                data: {
                    ...appointmentData,
                    patients: { connect: [{ id: patient.id }] }
                },
            });

            if (appt.status === 'DONE') {
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
    console.log(`- Seeded ${totalAppointments} appointments.`);
  }

  // 5. Update UserTechniqueStatus based on performance
  console.log("\nUpdating therapist statuses based on performance...");
  for (const user of createdUsers) {
    const userTechniqueStatuses = await prisma.userTechniqueStatus.findMany({
      where: { userId: user.id },
      include: { technique: true }
    });

    for (const status of userTechniqueStatuses) {
      const { technique } = status;
      const approvedAppointmentsCount = await prisma.appointment.count({
        where: {
          status: 'DONE',
          evaluation: AppointmentEvaluation.APPROVED,
          service: {
            techniques: {
              some: { id: technique.id }
            }
          },
          patients: {
            some: {
              userId: user.id
            }
          }
        }
      });

      if (approvedAppointmentsCount >= technique.requiredSessionsForTherapist) {
        await prisma.userTechniqueStatus.update({
          where: { id: status.id },
          data: { status: TechniqueStatus.THERAPIST }
        });
        console.log(`- Promoted ${user.name} to THERAPIST for technique: ${technique.name} (${approvedAppointmentsCount}/${technique.requiredSessionsForTherapist})`);
      } else {
         console.log(`- ${user.name} remains PRACTITIONER for technique: ${technique.name} (${approvedAppointmentsCount}/${technique.requiredSessionsForTherapist})`);
      }
    }
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
