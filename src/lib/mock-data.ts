import { Patient, Service, Appointment } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Use a consistent seed for reproducibility
faker.seed(123);

// Generate Patients
const mockPatients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] = [];
for (let i = 0; i < 10; i++) {
  mockPatients.push({
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.address.streetAddress(true),
    notes: faker.lorem.paragraph(),
  });
}

// Generate Services
const mockServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: 'Individual Therapy', price: 150.00, duration: 50, description: 'One-on-one therapy session with a licensed therapist.' },
    { name: 'Couples Counseling', price: 200.00, duration: 60, description: 'Therapy session for couples to improve their relationship.' },
    { name: 'Family Therapy', price: 250.00, duration: 90, description: 'Therapy session for families to resolve conflicts.' },
    { name: 'Cognitive Behavioral Therapy (CBT)', price: 160.00, duration: 50, description: 'A talk therapy that helps you manage your problems by changing the way you think and behave.' },
    { name: 'Dialectical Behavior Therapy (DBT)', price: 170.00, duration: 50, description: 'A therapy designed to help people suffering from mood disorders as well as those who need to change patterns of behavior.' },
    { name: 'Adolescent Counseling', price: 140.00, duration: 45, description: 'Specialized counseling for teenagers dealing with various life challenges.' },
    { name: 'Group Therapy', price: 80.00, duration: 90, description: 'A therapy session with a group of people who share similar experiences.' },
    { name: 'Mindfulness and Stress Reduction', price: 120.00, duration: 60, description: 'Techniques to manage stress and improve mental clarity.' },
    { name: 'Trauma-Informed Therapy', price: 180.00, duration: 60, description: 'An approach to therapy that recognizes and emphasizes understanding how the traumatic experience impacts mental, behavioral, emotional, physical, and spiritual well-being.' },
    { name: 'Career Counseling', price: 100.00, duration: 50, description: 'Guidance and support for individuals making career decisions.' },
    { name: 'Art Therapy', price: 130.00, duration: 75, description: 'Using creative methods of drawing, painting, and sculpting to help people express themselves.' },
    { name: 'Play Therapy', price: 135.00, duration: 45, description: 'A method of therapy that uses play to help children express their feelings and experiences.' },
    { name: 'Grief Counseling', price: 145.00, duration: 50, description: 'Support for individuals who have experienced the loss of a loved one.' }
];

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
                ? faker.date.past(1) // A past appointment
                : faker.date.future(1); // A future appointment
            
            appointments.push({
                patientId: patient.id,
                serviceId: randomService.id,
                date: date,
                description: faker.lorem.sentence(),
            });
        }
    });

    return appointments;
}

export { mockPatients, mockServices };
