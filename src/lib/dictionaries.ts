
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
    language: "Idioma",
    dashboard: {
        title: "Dashboard",
        totalPatients: "Total de Pacientes",
        allActivePatients: "Todos los pacientes activos",
        registeredServices: "Servicios Registrados",
        availableServices: "Terapias y servicios disponibles",
        upcomingAppointments: "Próximas Citas",
        allUpcomingAppointments: "Todas las próximas citas programadas",
        currentMonthSales: "Ventas del Mes Actual",
        revenueForThisMonth: "Ingresos de este mes",
        sales: "Ventas",
        appointments: "Citas",
        salesOverview: "Resumen de Ventas",
        trackRevenue: "Seguimiento de los ingresos durante un período seleccionado.",
        salesCountOverview: "Resumen de Cantidad de Ventas",
        trackSalesCount: "Seguimiento del número de ventas durante un período seleccionado."
    }
  },
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      patients: 'Patients',
      services: 'Services',
      appointments: 'Appointments',
      therapists: 'Therapists',
    },
    language: "Language",
    dashboard: {
        title: "Dashboard",
        totalPatients: "Total Patients",
        allActivePatients: "All active patients",
        registeredServices: "Registered Services",
        availableServices: "Available therapies and services",
        upcomingAppointments: "Upcoming Appointments",
        allUpcomingAppointments: "All upcoming programmed appointments",
        currentMonthSales: "Current Month Sales",
        revenueForThisMonth: "Revenue for this month",
        sales: "Sales",
        appointments: "Appointments",
        salesOverview: "Sales Overview",
        trackRevenue: "Track revenue over a selected period.",
        salesCountOverview: "Sales Count Overview",
        trackSalesCount: "Track number of sales over a selected period."
    }
  },
};

export type Dictionary = typeof dictionaries.es;
