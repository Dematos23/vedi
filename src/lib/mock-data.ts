export const mockPatients = [
  {
    id: "1",
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    notes: `Initial session with John. He expressed feelings of anxiety related to work pressure. We discussed coping mechanisms and set a goal to practice mindfulness for 10 minutes daily. He seems motivated to make positive changes.\n\nFollow-up session: John reports feeling a bit better after practicing mindfulness. He mentioned a recent conflict with a coworker that triggered his anxiety. We explored communication strategies to handle such situations.`,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-10-01"),
  },
  {
    id: "2",
    name: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    address: "456 Oak Ave, Anytown, USA",
    notes: "Jane is dealing with grief after the loss of a family member. Our session focused on providing a safe space for her to express her emotions. We talked about the stages of grief and the importance of self-compassion during this time.",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-09-25"),
  },
  {
    id: "3",
    name: "Peter",
    lastname: "Jones",
    email: "peter.jones@example.com",
    phone: "555-555-5555",
    address: "789 Pine Ln, Anytown, USA",
    notes: "Peter is seeking help for improving his relationships. We worked on identifying communication patterns and the impact of active listening. He has homework to practice 'I' statements with his partner.",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-09-30"),
  },
];

export const mockServices = [
  {
    id: "1",
    name: "Individual Therapy",
    price: 150.00,
    duration: 50, // in minutes
    description: "One-on-one therapy sessions.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Couples Counseling",
    price: 200.00,
    duration: 60, // in minutes
    description: "Therapy for couples to improve their relationship.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Cognitive Behavioral Therapy (CBT)",
    price: 175.00,
    duration: 55, // in minutes
    description: "A talk therapy that helps you manage your problems by changing the way you think and behave.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockAppointments = [
  {
    id: "1",
    date: new Date("2023-10-15T10:00:00"),
    patientId: "1",
    serviceId: "1",
    description: "Follow-up on anxiety management techniques.",
    createdAt: new Date("2023-10-01T10:00:00"),
    updatedAt: new Date("2023-10-01T10:00:00"),
  },
  {
    id: "2",
    date: new Date("2023-10-16T14:00:00"),
    patientId: "2",
    serviceId: "1",
    description: "Grief counseling session.",
    createdAt: new Date("2023-10-02T14:00:00"),
    updatedAt: new Date("2023-10-02T14:00:00"),
  },
  {
    id: "3",
    date: new Date("2023-10-17T11:30:00"),
    patientId: "3",
    serviceId: "2",
    description: "Relationship communication strategies.",
    createdAt: new Date("2023-10-03T11:30:00"),
    updatedAt: new Date("2023-10-03T11:30:00"),
  },
  {
    id: "4",
    date: new Date("2024-08-18T09:00:00"),
    patientId: "1",
    serviceId: "3",
    description: "CBT session focusing on negative thought patterns.",
    createdAt: new Date("2024-08-01T09:00:00"),
    updatedAt: new Date("2024-08-01T09:00:00"),
  },
];

export function getPatientById(id: string) {
    return mockPatients.find(p => p.id === id);
}

export function getServiceById(id: string) {
    return mockServices.find(s => s.id === id);
}
