
import { faker } from '@faker-js/faker';
import type { User, Patient, Service, Sale, Appointment } from '@prisma/client';
import { AppointmentStatus, Concurrency, ServiceStatus, UserType } from '@prisma/client';

// Use a consistent seed for reproducibility
faker.seed(123);

export const mockUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        name: 'Dr. Alice',
        lastname: 'Smith',
        email: 'alice.smith@vedi.com',
        password: 'password123', // In a real app, this would be hashed
        type: UserType.THERAPIST,
        phone: faker.phone.number()
    },
    {
        name: 'Dr. Bob',
        lastname: 'Johnson',
        email: 'bob.johnson@vedi.com',
        password: 'password123',
        type: UserType.THERAPIST,
        phone: faker.phone.number()
    },
    {
        name: 'Dr. Carol',
        lastname: 'Williams',
        email: 'carol.williams@vedi.com',
        password: 'password123',
        type: UserType.THERAPIST,
        phone: faker.phone.number()
    }
];

export const generateMockPatients = (count: number): Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'userId'>[] => {
    const patients = [];
    for (let i = 0; i < count; i++) {
        patients.push({
            name: faker.person.firstName(),
            secondname: i % 3 === 0 ? faker.person.middleName() : null,
            lastname: faker.person.lastName(),
            secondlastname: i % 4 === 0 ? faker.person.lastName() : null,
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(true),
        });
    }
    return patients;
};


export const mockServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'packageId' | 'techniques'>[] = [
    { name: 'Individual Therapy', price: 150.00, duration: 50, description: 'One-on-one therapy session with a licensed therapist.', status: 'ACTIVE' },
    { name: 'Couples Counseling', price: 200.00, duration: 60, description: 'Therapy session for couples to improve their relationship.', status: 'ACTIVE' },
    { name: 'Family Therapy', price: 250.00, duration: 90, description: 'Therapy session for families to resolve conflicts.', status: 'ACTIVE' },
    { name: 'Cognitive Behavioral Therapy (CBT)', price: 160.00, duration: 50, description: 'A talk therapy that helps you manage your problems by changing the way you think and behave.', status: 'ACTIVE' },
    { name: 'Group Therapy', price: 80.00, duration: 90, description: 'A therapy session with a group of people who share similar experiences.', status: 'INACTIVE' },
];

const roundUpToNearest15Minutes = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setSeconds(0, 0);
  const minutes = newDate.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  newDate.setMinutes(roundedMinutes);
  if (roundedMinutes === 60) {
      newDate.setHours(newDate.getHours() + 1);
      newDate.setMinutes(0);
  }
  return newDate;
};

// This will be called by the seed script after creating users, patients, and services.
export const generateMockSalesAndBalances = (patients: Patient[], services: Service[]): Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'packageId'>[] => {
    const sales: Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'packageId'>[] = [];
    if (!patients.length || !services.length) return [];
    
    patients.forEach(patient => {
        // Give each patient a balance for 1 or 2 services
        for(let i=0; i< faker.number.int({min: 1, max: 2}); i++) {
            const randomService = services[Math.floor(Math.random() * services.length)];
             sales.push({
                patientId: patient.id,
                serviceId: randomService.id,
                amount: randomService.price * 5, // Simulating a package of 5 sessions
                date: faker.date.past({ years: 1 }),
            });
        }
    });
    return sales;
};


export const generateMockAppointments = (patients: Patient[], services: Service[]): Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'packageId' | 'patients'>[] => {
    const appointments: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'packageId' | 'patients'>[] = [];
    if (!patients.length || !services.length) return [];

    patients.forEach(patient => {
        const activeServices = services.filter(s => s.status === 'ACTIVE');
        if (activeServices.length === 0) return;

        // Create 2-3 appointments for each patient
        for (let i = 0; i < faker.number.int({ min: 2, max: 3 }); i++) {
            const randomService = activeServices[Math.floor(Math.random() * activeServices.length)];
            const randomDate = (i % 2 === 0) 
                ? faker.date.between({ from: new Date(new Date().setDate(new Date().getDate() - 60)), to: new Date(new Date().setDate(new Date().getDate() - 1)) }) // Past
                : faker.date.between({ from: new Date(), to: new Date(new Date().setDate(new Date().getDate() + 60)) }); // Future

            const appointmentData: any = {
                date: roundUpToNearest15Minutes(randomDate),
                concurrency: Concurrency.SINGLE,
                status: AppointmentStatus.PROGRAMMED,
                description: `Scheduled session for ${randomService.name}.`,
                serviceId: randomService.id,
                patients: { connect: [{ id: patient.id }] }, // Connect patient
            };
            appointments.push(appointmentData);
        }
    });
    return appointments;
}
