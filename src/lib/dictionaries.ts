
export type Locale = 'es' | 'en';

export const dictionaries = {
  es: {
    sidebar: {
      dashboard: 'Dashboard',
      patients: 'Pacientes',
      services: 'Servicios',
      appointments: 'Citas',
      therapists: 'Terapeutas',
    },
    language: "Idioma"
  },
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      patients: 'Patients',
      services: 'Services',
      appointments: 'Appointments',
      therapists: 'Therapists',
    },
    language: "Language"
  },
};

export type Dictionary = typeof dictionaries.es;
