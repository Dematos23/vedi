
import { faker } from '@faker-js/faker';
import type { User, Patient, Service, Sale, Appointment, Technique, Package } from '@prisma/client';
import { AppointmentStatus, Concurrency, ServiceStatus, UserType, AppointmentEvaluation, TechniqueStatus } from '@prisma/client';

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

export const mockTechniques: Omit<Technique, 'id' | 'createdAt' | 'updatedAt' | 'requiredSessionsForTherapist'>[] = [
    { name: 'Aromaterapia', description: 'Uso de aceites esenciales para mejorar el bienestar físico y emocional.', url: 'https://www.example.com/aromaterapia' },
    { name: 'Reiki', description: 'Técnica de sanación energética mediante la imposición de manos.', url: 'https://www.example.com/reiki' },
    { name: 'Acupuntura', description: 'Estimulación de puntos específicos del cuerpo con agujas finas para aliviar el dolor.', url: 'https://www.example.com/acupuntura' },
    { name: 'Terapia Floral de Bach', description: 'Uso de esencias florales para equilibrar estados emocionales negativos.', url: 'https://www.example.com/terapia-floral' },
    { name: 'Reflexología Podal', description: 'Aplicación de presión en puntos de los pies para estimular órganos y mejorar la salud.', url: 'https://www.example.com/reflexologia' },
    { name: 'Meditación Guiada', description: 'Práctica de meditación con la guía de un instructor para alcanzar relajación profunda.', url: 'https://www.example.com/meditacion' },
    { name: 'Cristaloterapia', description: 'Uso de cristales y piedras para equilibrar la energía del cuerpo.', url: 'https://www.example.com/cristaloterapia' }
];

const latinAmericanNames = [
    'Juan', 'Carlos', 'Luis', 'Javier', 'Miguel', 'Jose', 'Maria', 'Ana', 'Sofia', 'Camila',
    'Diego', 'Alejandro', 'Fernando', 'Ricardo', 'Gabriel', 'Valentina', 'Isabella', 'Lucia', 'Mariana', 'Valeria'
];
const latinAmericanLastnames = [
    'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
    'Flores', 'Rivera', 'Gomez', 'Diaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Gutierrez', 'Chavez'
];

// Data for Peruvian addresses
const peruvianStreetTypes = ['Av.', 'Jr.', 'Calle'];
const peruvianStreetNames = ['Arequipa', 'Larco', 'Pardo', 'Javier Prado', 'Benavides', 'Angamos', 'Salaverry', 'Conquistadores', 'El Sol', 'Grau'];
const peruvianDistricts = ['Miraflores', 'San Isidro', 'Barranco', 'Santiago de Surco', 'La Molina', 'Lince', 'Jesús María', 'Pueblo Libre'];
const peruvianCities = ['Lima', 'Arequipa', 'Cusco', 'Trujillo'];

export const generateMockPatients = (count: number): Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] => {
    const patients = [];
    const emailProviders = ['gmail.com', 'hotmail.com', 'yahoo.com'];

    for (let i = 0; i < count; i++) {
        const name = faker.helpers.arrayElement(latinAmericanNames);
        const lastname = faker.helpers.arrayElement(latinAmericanLastnames);
        const secondname = i % 3 === 0 ? faker.helpers.arrayElement(latinAmericanNames) : null;
        const secondlastname = i % 4 === 0 ? faker.helpers.arrayElement(latinAmericanLastnames) : null;
        
        const email = `${name.toLowerCase()}.${lastname.toLowerCase()}@${faker.helpers.arrayElement(emailProviders)}`;
        const phone = `9${faker.string.numeric(2)}-${faker.string.numeric(3)}-${faker.string.numeric(3)}`;
        
        const streetType = faker.helpers.arrayElement(peruvianStreetTypes);
        const streetName = faker.helpers.arrayElement(peruvianStreetNames);
        const streetNumber = faker.number.int({ min: 100, max: 2000 });
        const district = faker.helpers.arrayElement(peruvianDistricts);
        const city = faker.helpers.arrayElement(peruvianCities);
        const address = `${streetType} ${streetName} ${streetNumber}, ${district}, ${city}`;

        patients.push({
            name,
            secondname,
            lastname,
            secondlastname,
            email,
            phone,
            address: address,
            notes: "Notas de la consulta inicial. El paciente expresó preocupaciones sobre el estrés relacionado con el trabajo y la dificultad para dormir. Se discutieron posibles estrategias de afrontamiento y se programó un seguimiento.",
        });
    }
    return patients;
};

export const mockServices: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'packageId'>[] = [
    { name: 'Terapia Individual', price: 150.00, duration: 50, description: 'Sesión de terapia uno a uno con un terapeuta licenciado.', status: 'ACTIVE' },
    { name: 'Consejería de Parejas', price: 200.00, duration: 60, description: 'Sesión de terapia para parejas para mejorar su relación.', status: 'ACTIVE' },
    { name: 'Terapia Familiar', price: 250.00, duration: 90, description: 'Sesión de terapia para familias para resolver conflictos.', status: 'ACTIVE' },
    { name: 'Terapia Cognitivo-Conductual (TCC)', price: 160.00, duration: 50, description: 'Una terapia de conversación que te ayuda a manejar tus problemas cambiando tu forma de pensar y comportarte.', status: 'ACTIVE' },
    { name: 'Terapia de Grupo', price: 80.00, duration: 90, description: 'Una sesión de terapia con un grupo de personas que comparten experiencias similares.', status: 'INACTIVE' },
];

export const mockPackages: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { name: 'Paquete de 5 Sesiones de Terapia Individual', description: 'Ahorra comprando 5 sesiones de Terapia Individual por adelantado.', price: 700.00 },
    { name: 'Paquete Relajación Total', description: 'Combina Aromaterapia y Meditación Guiada para una relajación completa.', price: 250.00 },
];

const roundUpToNearest15Minutes = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setSeconds(0, 0);
  const minutes = newDate.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  newDate.setMinutes(roundedMinutes);
  if (roundedMinutes >= 60) {
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
        const activeServices = services.filter(s => s.status === 'ACTIVE');
        const servicesToBuy = faker.helpers.arrayElements(activeServices, faker.number.int({min: 1, max: 2}));
        
        for(const randomService of servicesToBuy) {
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

// This is a more complex appointment generator that respects therapist-technique-service relationships
export const generateMockAppointments = (
    patient: Patient,
    servicesForTherapist: (Service & { techniques: Technique[] })[]
): { appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>, techniquesUsed: Technique[], service: Service }[] => {
    
    const appointments: { appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>, techniquesUsed: Technique[], service: Service }[] = [];
    if (!servicesForTherapist.length) return [];
    
    // Determine the number of past and future appointments
    const pastAppointmentsCount = faker.number.int({ min: 1, max: 3 });
    const futureAppointmentsCount = faker.number.int({ min: 1, max: 2 });

    // Create past appointments
    for (let i = 0; i < pastAppointmentsCount; i++) {
        const service = faker.helpers.arrayElement(servicesForTherapist);
        const randomDate = faker.date.between({ from: new Date(new Date().setDate(new Date().getDate() - 90)), to: new Date(new Date().setDate(new Date().getDate() - 1)) });
        
        const appointmentData: any = {
            date: roundUpToNearest15Minutes(randomDate),
            concurrency: Concurrency.SINGLE,
            status: AppointmentStatus.DONE,
            evaluation: faker.helpers.arrayElement([AppointmentEvaluation.APPROVED, AppointmentEvaluation.REJECTED, AppointmentEvaluation.UNDER_EVALUATION]),
            description: `Sesión completada para ${service.name}. El paciente discutió el progreso en sus objetivos.`,
            serviceId: service.id,
        };
        
        appointments.push({
            appointmentData,
            techniquesUsed: service.techniques,
            service,
        });
    }

    // Create future appointments
    for (let i = 0; i < futureAppointmentsCount; i++) {
        const service = faker.helpers.arrayElement(servicesForTherapist);
        const randomDate = faker.date.between({ from: new Date(new Date().setDate(new Date().getDate() + 1)), to: new Date(new Date().setDate(new Date().getDate() + 90)) });

        const appointmentData: any = {
            date: roundUpToNearest15Minutes(randomDate),
            concurrency: Concurrency.SINGLE,
            status: AppointmentStatus.PROGRAMMED,
            evaluation: null,
            description: `Sesión programada para ${service.name}.`,
            serviceId: service.id,
        };

        appointments.push({
            appointmentData,
            techniquesUsed: service.techniques,
            service,
        });
    }

    return appointments;
}
