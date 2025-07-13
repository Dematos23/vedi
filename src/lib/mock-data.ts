import { Patient, Service, Appointment } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Decimal } from '@prisma/client/runtime/library';

// Use a consistent seed for reproducibility
faker.seed(123);

// Generate Patients
const mockPatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] = [];
for (let i = 0; i < 10; i++) {
  mockPatients.push({
    name: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(true),
    notes: faker.lorem.paragraph(),
  });
}

const mockServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: 'Individual Therapy', price: new Decimal(150.00), duration: 50, description: 'One-on-one therapy session with a licensed therapist.', status: 'ACTIVE' },
    { name: 'Couples Counseling', price: new Decimal(200.00), duration: 60, description: 'Therapy session for couples to improve their relationship.', status: 'ACTIVE' },
    { name: 'Family Therapy', price: new Decimal(250.00), duration: 90, description: 'Therapy session for families to resolve conflicts.', status: 'ACTIVE' },
    { name: 'Cognitive Behavioral Therapy (CBT)', price: new Decimal(160.00), duration: 50, description: 'A talk therapy that helps you manage your problems by changing the way you think and behave.', status: 'ACTIVE' },
    { name: 'Dialectical Behavior Therapy (DBT)', price: new Decimal(170.00), duration: 50, description: 'A therapy designed to help people suffering from mood disorders as well as those who need to change patterns of behavior.', status: 'ACTIVE' },
    { name: 'Adolescent Counseling', price: new Decimal(140.00), duration: 45, description: 'Specialized counseling for teenagers dealing with various life challenges.', status: 'ACTIVE' },
    { name: 'Group Therapy', price: new Decimal(80.00), duration: 90, description: 'A therapy session with a group of people who share similar experiences.', status: 'ACTIVE' },
    { name: 'Mindfulness and Stress Reduction', price: new Decimal(120.00), duration: 60, description: 'Techniques to manage stress and improve mental clarity.', status: 'ACTIVE' },
    { name: 'Trauma-Informed Therapy', price: new Decimal(180.00), duration: 60, description: 'An approach to therapy that recognizes and emphasizes understanding how the traumatic experience impacts mental, behavioral, emotional, physical, and spiritual well-being.', status: 'ACTIVE' },
    { name: 'Career Counseling', price: new Decimal(100.00), duration: 50, description: 'Guidance and support for individuals making career decisions.', status: 'ACTIVE' },
    { name: 'Art Therapy', price: new Decimal(130.00), duration: 75, description: 'Using creative methods of drawing, painting, and sculpting to help people express themselves.', status: 'ACTIVE' },
    { name: 'Play Therapy', price: new Decimal(135.00), duration: 45, description: 'A method of therapy that uses play to help children express their feelings and experiences.', status: 'ACTIVE' },
    { name: 'Grief Counseling', price: new Decimal(145.00), duration: 50, description: 'Support for individuals who have experienced the loss of a loved one.', status: 'ACTIVE' }
];

const convertToSafeDate = (date: Date) => {
    // To avoid timezone issues during SSR/CSR hydration, we can return the date in a consistent format like ISO string
    // or just the Date object itself if the database driver and server handle it consistently.
    // For this mock, we'll just return the date object as is, assuming consistent handling.
    return date;
}


// This function will be called by the seed script.
// It generates appointments dynamically based on the created patients and services.
export const generateMockAppointments = (patients: Patient[], services: Service[]): Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'service'>[] => {
    const appointments: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'service'>[] = [];

    if (!patients.length || !services.length) {
        return [];
    }
    
    patients.forEach(patient => {
        // Create 3 appointments for each patient
        for (let i = 0; i < 3; i++) {
            const randomService = services[Math.floor(Math.random() * services.length)];
            const date = (i % 2 === 0) 
                ? faker.date.past({ years: 1 }) // A past appointment
                : faker.date.future({ years: 1 }); // A future appointment
            
            appointments.push({
                patientId: patient.id,
                serviceId: randomService.id,
                price: randomService.price,
                date: convertToSafeDate(date),
                description: `Session focused on cognitive restructuring techniques to address anxiety. Patient reported progress in identifying automatic negative thoughts. We practiced mindfulness exercises to ground them during moments of panic. Homework assigned: thought record for the upcoming week.`,
            });
        }
    });

    return appointments;
}

export { mockPatients, mockServices };
