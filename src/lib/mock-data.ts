export const mockPatients = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    notes: `Initial session with John. He expressed feelings of anxiety related to work pressure. We discussed coping mechanisms and set a goal to practice mindfulness for 10 minutes daily. He seems motivated to make positive changes.\n\nFollow-up session: John reports feeling a bit better after practicing mindfulness. He mentioned a recent conflict with a coworker that triggered his anxiety. We explored communication strategies to handle such situations.`,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-10-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    address: "456 Oak Ave, Anytown, USA",
    notes: "Jane is dealing with grief after the loss of a family member. Our session focused on providing a safe space for her to express her emotions. We talked about the stages of grief and the importance of self-compassion during this time.",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-09-25"),
  },
  {
    id: "3",
    name: "Peter Jones",
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
    description: "One-on-one therapy sessions.",
  },
  {
    id: "2",
    name: "Couples Counseling",
    description: "Therapy for couples to improve their relationship.",
  },
  {
    id: "3",
    name: "Cognitive Behavioral Therapy (CBT)",
    description: "A talk therapy that helps you manage your problems by changing the way you think and behave.",
  },
];

export const mockAppointments = [
  {
    id: "1",
    date: new Date("2023-10-15T10:00:00"),
    patientId: "1",
    serviceId: "1",
    description: "Follow-up on anxiety management techniques.",
  },
  {
    id: "2",
    date: new Date("2023-10-16T14:00:00"),
    patientId: "2",
    serviceId: "1",
    description: "Grief counseling session.",
  },
  {
    id: "3",
    date: new Date("2023-10-17T11:30:00"),
    patientId: "3",
    serviceId: "2",
    description: "Relationship communication strategies.",
  },
    {
    id: "4",
    date: new Date("2023-10-18T09:00:00"),
    patientId: "1",
    serviceId: "3",
    description: "CBT session focusing on negative thought patterns.",
  },
];
