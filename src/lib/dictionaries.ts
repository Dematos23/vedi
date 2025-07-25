
export type Locale = 'es' | 'en';

export const dictionaries = {
  es: {
    sidebar: {
      dashboard: 'Dashboard',
      patients: 'Pacientes',
      services: 'Servicios',
      appointments: 'Citas',
      therapists: 'Terapeutas',
      techniques: 'Técnicas',
      sales: 'Ventas',
      packages: 'Paquetes',
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
    },
    patients: {
      title: "Pacientes",
      newPatient: "Nuevo Paciente",
      searchPlaceholder: "Buscar por nombre o email...",
      noResults: "No se encontraron resultados.",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      actions: "Acciones",
      createNewPatient: "Crear Nuevo Paciente",
      fillInDetails: "Completa los detalles del nuevo paciente.",
      firstName: "Nombre",
      middleName: "Segundo Nombre",
      lastName: "Apellido",
      secondLastName: "Segundo Apellido",
      phoneNumber: "Número de Teléfono",
      address: "Dirección",
      cancel: "Cancelar",
      createPatient: "Crear Paciente",
      creating: "Creando...",
      backToPatients: "Volver a Pacientes",
      serviceBalances: "Saldos de Servicios",
      serviceBalancesDescription: "Seguimiento de los paquetes de sesiones comprados por el paciente.",
      used: "usado",
      noActiveBalances: "No hay saldos de servicios activos.",
      appointmentHistory: "Historial de Citas",
      exportPdf: "Exportar PDF",
      summarizeWithAi: "Resumir con IA",
      summarizing: "Resumiendo...",
      service: "Servicio",
      date: "Fecha",
      status: "Estado",
      view: "Ver",
      noAppointmentsFound: "No se encontraron citas.",
      patientDetails: "Detalles del Paciente",
      therapistNotes: "Notas del Terapeuta",
      editNotes: "Editar Notas",
      startTyping: "Empieza a escribir las notas de la sesión...",
      save: "Guardar",
      saving: "Guardando...",
      aiSummary: "Resumen de IA",
      error: "Error",
      summaryError: "No se pudo generar el resumen. Por favor, inténtalo de nuevo.",
      emptyNotesError: "No se pueden resumir notas vacías.",
      patientInformation: "Información del Paciente",
      editPatient: "Editar Paciente",
      contactDetails: "Detalles de Contacto",
      noNotesAdded: "Aún no se han añadido notas para este paciente."
    },
    services: {
        title: "Servicios",
        newService: "Nuevo Servicio",
        searchPlaceholder: "Buscar por nombre o descripción...",
        noServicesFound: "No se encontraron servicios.",
        allStatuses: "Todos los Estados",
        filterByStatus: "Filtrar por estado",
        price: "Precio",
        duration: "Duración",
        status: "Estado",
        actions: "Acciones",
        edit: "Editar",
        delete: "Eliminar",
        save: "Guardar",
        saving: "Guardando...",
        cancel: "Cancelar",
        activate: "Activar",
        deactivate: "Desactivar",
        viewDetails: "Ver Detalles",
        areYouSure: "¿Estás seguro?",
        deleteWarning: "Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio.",
        cannotDelete: "No se puede eliminar el servicio",
        deactivationWarning: "Este servicio tiene citas asociadas y no se puede eliminar. ¿Te gustaría desactivarlo en su lugar? Los servicios desactivados no aparecerán al crear nuevas citas.",
        registerNewService: "Registrar Nuevo Servicio",
        addNewService: "Añade una nueva terapia o servicio al registro.",
        serviceName: "Nombre del Servicio",
        serviceNameExample: "p. ej., Terapia Individual",
        descriptionLabel: "Descripción",
        descriptionPlaceholder: "Describe el servicio...",
        priceLabel: "Precio ($)",
        durationLabel: "Duración (min)",
        registering: "Registrando...",
        registerService: "Registrar Servicio",
        backToServices: "Volver a Servicios",
        serviceDetails: "Detalles del Servicio",
        recentAppointments: "Citas Recientes",
        recentAppointmentsDescription: "Una lista de las citas más recientes para este servicio.",
        patient: "Paciente(s)",
        date: "Fecha",
        noAppointmentsFound: "No se encontraron citas para este servicio.",
        view: "Ver"
    },
    appointments: {
        title: "Citas",
        newAppointment: "Nueva Cita",
        searchPlaceholder: "Buscar por paciente o servicio...",
        noAppointmentsFound: "No se encontraron citas.",
        patients: "Paciente(s)",
        service: "Servicio",
        date: "Fecha",
        time: "Hora",
        status: "Estado",
        approvalStatus: "Evaluación",
        actions: "Acciones",
        view: "Ver",
        approve: "Aprobar",
        approving: "Aprobando...",
        reject: "Rechazar",
        rejecting: "Rechazando...",
        filterByStatus: "Filtrar por Estado",
        allStatuses: "Todos los Estados",
        filterByService: "Filtrar por servicio...",
        filterByDate: "Filtrar por fecha",
        all: "Todo",
        today: "Hoy",
        thisWeek: "Esta Semana",
        thisMonth: "Este Mes",
        thisYear: "Este Año",
        nextMonth: "Próximo Mes",
        filters: "Filtros",
        scheduleAppointment: "Programar Cita",
        scheduleAppointmentDescription: "Complete los detalles para crear una nueva cita.",
        patientsLabel: "Pacientes",
        selectPatientsPlaceholder: "Selecciona paciente(s)...",
        serviceLabel: "Servicio",
        selectServicePlaceholder: "Selecciona un servicio",
        dateLabel: "Fecha y Hora",
        concurrencyLabel: "Concurrencia",
        descriptionLabel: "Descripción",
        descriptionPlaceholder: "Detalles de la sesión...",
        scheduleButton: "Programar",
        schedulingButton: "Programando...",
        appointmentDetails: "Detalles de la Cita",
        backToAppointments: "Volver a Citas",
        markAsDone: "Marcar como Realizada",
        completing: "Completando...",
        exportPdf: "Exportar PDF",
        exporting: "Exportando...",
        scheduledOn: "Programada para",
        loadingDate: "Cargando fecha...",
        patientInformation: "Información del Paciente",
        email: "Email",
        phone: "Teléfono",
        serviceDetails: "Detalles del Servicio",
        price: "Precio",
        duration: "Duración",
        sessionNotes: "Notas de la Sesión",
        sessionNotesDescription: "Ver o editar notas de la sesión a continuación.",
        editNotes: "Editar Notas",
        saveNotes: "Guardar Notas",
        savingNotes: "Guardando...",
        cancel: "Cancelar",
        noNotes: "Aún no se han añadido notas para esta sesión.",
        agendaView: "Vista de Agenda",
        selectTherapist: "Seleccionar un terapeuta"
    },
    therapists: {
        title: "Terapeutas",
        newTherapist: "Nuevo Terapeuta",
        name: "Nombre",
        email: "Email",
        phone: "Teléfono",
        assignedPatients: "Pacientes Asignados",
        appointments: "Citas",
        performance: "Desempeño",
        actions: "Acciones",
        viewPerformance: "Ver",
        noTherapistsFound: "No se encontraron terapeutas.",
        backToTherapists: "Volver a Terapeutas",
        performanceTitle: (name: string, lastname: string) => `Desempeño de Dr. ${name} ${lastname}`,
        appointmentsThisMonth: "Citas (Este Mes)",
        totalSalesGenerated: "Ventas Totales Generadas",
        techniquePerformance: "Desempeño de Técnicas",
        uses: "usos",
        noTechniquesAssigned: "No hay técnicas asignadas a este terapeuta.",
        recentAppointments: "Citas Recientes",
        patient: "Paciente(s)",
        service: "Servicio",
        date: "Fecha",
        view: "Ver",
        noRecentAppointments: "No se encontraron citas recientes.",
        viewPatient: "Ver Paciente",
        noPatientsAssigned: "No hay pacientes asignados.",
        assignTechnique: "Asignar Técnica",
        assignTechniqueDescription: "Seleccione las técnicas para asignar a este terapeuta.",
        allTechniques: "Todas las técnicas",
        selectTechniquesPlaceholder: "Seleccionar técnicas...",
        assign: "Asignar",
        assigning: "Asignando...",
        cancel: "Cancelar",
        passwordDialogTitle: (name: string) => `Contraseña Creada para ${name}`,
        passwordDialogDescription: "La contraseña del terapeuta ha sido creada. Por favor, proporciónale su nueva contraseña de forma segura.",
    },
    techniques: {
      title: "Técnicas",
      newTechnique: "Nueva Técnica",
      searchPlaceholder: "Buscar por nombre o descripción...",
      noTechniquesFound: "No se encontraron técnicas.",
      techniqueName: "Nombre de la Técnica",
      descriptionLabel: "Descripción",
      therapists: "Terapeutas",
      actions: "Acciones",
      view: "Ver",
      readMore: "Leer más",
      readLess: "Leer menos",
      url: "URL",
      enroll: "Inscribirse",
      edit: "Editar",
      delete: "Eliminar",
      save: "Guardar",
      saving: "Guardando...",
      cancel: "Cancelar",
      areYouSure: "¿Estás seguro?",
      deleteWarning: "Esta acción no se puede deshacer. Esto eliminará permanentemente la técnica.",
      cannotDelete: "No se puede eliminar la técnica",
      deactivationWarning: "Esta técnica está asociada con servicios o terapeutas y no puede ser eliminada.",
      registerNewTechnique: "Registrar Nueva Técnica",
      addNewTechnique: "Añade una nueva técnica terapéutica al registro.",
      techniqueNameExample: "p. ej., Terapia Cognitiva",
      descriptionPlaceholder: "Describe la técnica...",
      registering: "Registrando...",
      registerTechnique: "Registrar Técnica",
      backToTechniques: "Volver a Técnicas",
      techniqueDetails: "Detalles de la Técnica",
      servicesUsingTechnique: "Servicios que Utilizan esta Técnica",
      noServicesFound: "No se han encontrado servicios que utilicen esta técnica.",
      therapistsAssigned: "Terapeutas Asignados a esta Técnica",
      noTherapistsFound: "No se han encontrado terapeutas asignados a esta técnica.",
      therapist: "Terapeuta",
      status: "Estado",
      performance: "Desempeño"
    },
    sales: {
        title: "Ventas",
        newSale: "Nueva Venta",
        searchPlaceholder: "Buscar por paciente o item...",
        noSalesFound: "No se encontraron ventas.",
        date: "Fecha",
        patient: "Paciente",
        item: "Ítem",
        amount: "Monto",
        registerSale: "Registrar Venta",
        registerSaleDescription: "Registra una nueva venta de un servicio o paquete.",
        patientLabel: "Paciente",
        selectPatientPlaceholder: "Selecciona un paciente",
        saleTypeLabel: "Tipo de Venta",
        saleTypeService: "Servicio",
        saleTypePackage: "Paquete",
        serviceLabel: "Servicio",
        selectServicePlaceholder: "Selecciona un servicio",
        packageLabel: "Paquete",
        selectPackagePlaceholder: "Selecciona un paquete",
        sessionsLabel: "Número de Sesiones",
        amountLabel: "Monto ($)",
        registerButton: "Registrar Venta",
        registeringButton: "Registrando...",
        cancel: "Cancelar",
        actions: "Acciones"
    },
    packages: {
      title: "Paquetes",
      newPackage: "Nuevo Paquete",
      searchPlaceholder: "Buscar por nombre...",
      noPackagesFound: "No se encontraron paquetes.",
      packageName: "Nombre del Paquete",
      description: "Descripción",
      price: "Precio",
      services: "Servicios",
      actions: "Acciones",
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
      registerNewPackage: "Registrar Nuevo Paquete",
      addNewPackage: "Crea un nuevo paquete agrupando servicios existentes.",
      packageNameExample: "p. ej., Paquete de Relajación",
      descriptionPlaceholder: "Describe el contenido del paquete...",
      priceLabel: "Precio ($)",
      servicesLabel: "Servicios Incluidos",
      selectServicesPlaceholder: "Selecciona servicios...",
      registering: "Registrando...",
      registerPackage: "Registrar Paquete",
      cancel: "Cancelar",
    },
    toasts: {
        success: {
            title: "Éxito",
            appointmentNotesUpdated: "Las notas de la cita han sido actualizadas.",
            appointmentMarkedAsDone: "La cita ha sido marcada como realizada.",
            appointmentEvaluated: (evaluation: string) => `La cita ha sido ${evaluation}.`,
            appointmentScheduled: "La nueva cita ha sido programada.",
            patientCreated: "El nuevo paciente ha sido creado.",
            patientDetailsUpdated: "Los detalles del paciente han sido actualizados.",
            serviceRegistered: "El nuevo servicio ha sido registrado.",
            serviceUpdated: "El servicio ha sido actualizado.",
            serviceDeleted: "El servicio ha sido eliminado.",
            serviceActivated: "El servicio ha sido activado.",
            serviceDeactivated: "El servicio ha sido desactivado.",
            techniqueRegistered: "La nueva técnica ha sido registrada.",
            techniqueUpdated: "La técnica ha sido actualizada.",
            techniqueDeleted: "La técnica ha sido eliminada.",
            therapistsAssigned: "Terapeutas asignados exitosamente.",
            passwordCopied: "La nueva contraseña ha sido copiada al portapapeles.",
            therapistCreated: "El nuevo terapeuta ha sido creado.",
            techniquesAssigned: "Técnicas asignadas correctamente.",
            saleRegistered: "La venta ha sido registrada exitosamente.",
            packageCreated: "El nuevo paquete ha sido creado.",
        },
        error: {
            title: "Error",
            actionRequired: "Acción Requerida",
            unknown: "Ocurrió un error desconocido.",
            failedToUpdateNotes: "Error al actualizar las notas. Por favor, inténtalo de nuevo.",
            multiPatientCompletion: "Completar citas con múltiples pacientes aún no está soportado en esta demo.",
            completionFailed: "Error en la Finalización",
            failedToEvaluate: "Error al evaluar la cita. Por favor, inténtalo de nuevo.",
            failedToScheduleAppointment: "Error al programar la cita. Por favor, inténtalo de nuevo.",
            failedToCreatePatient: "Error al crear el paciente. Por favor, inténtalo de nuevo.",
            failedToUpdatePatient: "Error al actualizar los detalles del paciente. Por favor, inténtalo de nuevo.",
            failedToRegisterService: "Error al registrar el servicio. Por favor, inténtalo de nuevo.",
            failedToUpdateService: "Error al actualizar el servicio. Por favor, inténtalo de nuevo.",
            failedToDeleteService: "Error al eliminar el servicio. Por favor, inténtalo de nuevo.",
            failedToUpdateServiceStatus: "Error al actualizar el estado del servicio.",
            failedToRegisterTechnique: "Error al registrar la técnica. Por favor, inténtalo de nuevo.",
            failedToUpdateTechnique: "Error al actualizar la técnica. Por favor, inténtalo de nuevo.",
            failedToDeleteTechnique: "Error al eliminar la técnica. Por favor, inténtalo de nuevo.",
            failedToAssignTherapists: "Error al asignar terapeutas. Por favor, inténtalo de nuevo.",
            failedToResetPassword: "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.",
            failedToCreateTherapist: "Error al crear el terapeuta. Por favor, inténtalo de nuevo.",
            failedToAssignTechniques: "Error al asignar técnicas. Por favor, inténtalo de nuevo.",
            failedToRegisterSale: "Error al registrar la venta. Por favor, inténtalo de nuevo.",
            failedToCreatePackage: "Error al crear el paquete. Por favor, inténtalo de nuevo.",
        }
    },
    enums: {
      appointmentStatus: {
        PROGRAMMED: "Programada",
        DONE: "Realizada",
      },
      appointmentEvaluation: {
        UNDER_EVALUATION: "En Evaluación",
        APPROVED: "Aprobada",
        REJECTED: "Rechazada",
      },
      concurrency: {
        SINGLE: "Única",
        MULTIPLE: "Múltiple",
      },
      serviceStatus: {
        ACTIVE: "Activo",
        INACTIVE: "Inactivo",
      },
      techniqueStatus: {
        PRACTITIONER: "Practicante",
        THERAPIST: "Terapeuta",
      },
      validationStatus: {
        PENDING: "En evaluación",
        APPROVED: "Aprobada",
      }
    }
  },
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      patients: 'Patients',
      services: 'Services',
      appointments: 'Appointments',
      therapists: 'Therapists',
      techniques: 'Techniques',
      sales: 'Sales',
      packages: 'Packages',
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
    },
    patients: {
      title: "Patients",
      newPatient: "New Patient",
      searchPlaceholder: "Search by name or email...",
      noResults: "No results found.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      actions: "Actions",
      createNewPatient: "Create New Patient",
      fillInDetails: "Fill in the details for the new patient.",
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      secondLastName: "Second Last Name",
      phoneNumber: "Phone Number",
      address: "Address",
      cancel: "Cancel",
      createPatient: "Create Patient",
      creating: "Creating...",
      backToPatients: "Back to Patients",
      serviceBalances: "Service Balances",
      serviceBalancesDescription: "Track the patient's purchased session packages.",
      used: "used",
      noActiveBalances: "No active service balances.",
      appointmentHistory: "Appointment History",
      exportPdf: "Export PDF",
      summarizeWithAi: "Summarize with AI",
      summarizing: "Summarizing...",
      service: "Service",
      date: "Date",
      status: "Status",
      view: "View",
      noAppointmentsFound: "No appointments found.",
      patientDetails: "Patient Details",
      therapistNotes: "Therapist Notes",
      editNotes: "Edit Notes",
      startTyping: "Start typing session notes...",
      save: "Save",
      saving: "Saving...",
      aiSummary: "AI Summary",
      error: "Error",
      summaryError: "Failed to generate summary. Please try again.",
      emptyNotesError: "Cannot summarize empty notes.",
      patientInformation: "Patient Information",
      editPatient: "Edit Patient",
      contactDetails: "Contact Details",
      noNotesAdded: "No notes have been added for this patient yet."
    },
    services: {
        title: "Services",
        newService: "New Service",
        searchPlaceholder: "Search by service name or description...",
        noServicesFound: "No services found.",
        allStatuses: "All Statuses",
        filterByStatus: "Filter by status",
        price: "Price",
        duration: "Duration",
        status: "Status",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        activate: "Activate",
        deactivate: "Deactivate",
        viewDetails: "View Details",
        areYouSure: "Are you sure?",
        deleteWarning: "This action cannot be undone. This will permanently delete the service.",
        cannotDelete: "Cannot Delete Service",
        deactivationWarning: "This service has appointments associated with it and cannot be deleted. Would you like to deactivate it instead? Deactivated services will not appear when creating new appointments.",
        registerNewService: "Register New Service",
        addNewService: "Add a new therapy or service to the registry.",
        serviceName: "Service Name",
        serviceNameExample: "e.g., Individual Therapy",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Describe the service...",
        priceLabel: "Price ($)",
        durationLabel: "Duration (min)",
        registering: "Registering...",
        registerService: "Register Service",
        backToServices: "Back to Services",
        serviceDetails: "Service Details",
        recentAppointments: "Recent Appointments",
        recentAppointmentsDescription: "A list of the most recent appointments for this service.",
        patient: "Patient(s)",
        date: "Date",
        noAppointmentsFound: "No appointments found for this service.",
        view: "View"
    },
     appointments: {
        title: "Appointments",
        newAppointment: "New Appointment",
        searchPlaceholder: "Search by patient or service...",
        noAppointmentsFound: "No appointments found.",
        patients: "Patient(s)",
        service: "Service",
        date: "Date",
        time: "Time",
        status: "Status",
        approvalStatus: "Evaluation",
        actions: "Actions",
        view: "View",
        approve: "Approve",
        approving: "Approving...",
        reject: "Reject",
        rejecting: "Rejecting...",
        filterByStatus: "Filter by Status",
        allStatuses: "All Statuses",
        filterByService: "Filter by service...",
        filterByDate: "Filter by date",
        all: "All",
        today: "Today",
        thisWeek: "This Week",
        thisMonth: "This Month",
        thisYear: "This Year",
        nextMonth: "Next Month",
        filters: "Filters",
        scheduleAppointment: "Schedule Appointment",
        scheduleAppointmentDescription: "Fill in the details to create a new appointment.",
        patientsLabel: "Patients",
        selectPatientsPlaceholder: "Select patient(s)...",
        serviceLabel: "Service",
        selectServicePlaceholder: "Select a service",
        dateLabel: "Date & Time",
        concurrencyLabel: "Concurrency",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Session details...",
        scheduleButton: "Schedule",
        schedulingButton: "Scheduling...",
        appointmentDetails: "Appointment Details",
        backToAppointments: "Back to Appointments",
        markAsDone: "Mark as Done",
        completing: "Completing...",
        exportPdf: "Export PDF",
        exporting: "Exporting...",
        scheduledOn: "Scheduled on",
        loadingDate: "Loading date...",
        patientInformation: "Patient Information",
        email: "Email",
        phone: "Phone",
        serviceDetails: "Service Details",
        price: "Price",
        duration: "Duration",
        sessionNotes: "Session Notes",
        sessionNotesDescription: "View or edit session notes below.",
        editNotes: "Edit Notes",
        saveNotes: "Save Notes",
        savingNotes: "Saving...",
        cancel: "Cancel",
        noNotes: "No notes have been added for this session yet.",
        agendaView: "Agenda View",
        selectTherapist: "Select a therapist"
    },
    therapists: {
        title: "Therapists",
        newTherapist: "New Therapist",
        name: "Name",
        email: "Email",
        phone: "Phone",
        assignedPatients: "Assigned Patients",
        appointments: "Appointments",
        performance: "Performance",
        actions: "Actions",
        viewPerformance: "View",
        noTherapistsFound: "No therapists found.",
        backToTherapists: "Back to Therapists",
        performanceTitle: (name: string, lastname: string) => `Dr. ${name} ${lastname}'s Performance`,
        appointmentsThisMonth: "Appointments (This Month)",
        totalSalesGenerated: "Total Sales Generated",
        techniquePerformance: "Technique Performance",
        uses: "uses",
        noTechniquesAssigned: "No techniques assigned to this therapist.",
        recentAppointments: "Recent Appointments",
        patient: "Patient(s)",
        service: "Service",
        date: "Date",
        view: "View",
        noRecentAppointments: "No recent appointments found.",
        viewPatient: "View Patient",
        noPatientsAssigned: "No patients assigned.",
        assignTechnique: "Assign Technique",
        assignTechniqueDescription: "Select techniques to assign to this therapist.",
        allTechniques: "All Techniques",
        selectTechniquesPlaceholder: "Select techniques...",
        assign: "Assign",
        assigning: "Assigning...",
        cancel: "Cancel",
        passwordDialogTitle: (name: string) => `Password Created for ${name}`,
        passwordDialogDescription: "The therapist's password has been created. Please provide them with their new password securely."
    },
    techniques: {
      title: "Techniques",
      newTechnique: "New Technique",
      searchPlaceholder: "Search by name or description...",
      noTechniquesFound: "No techniques found.",
      techniqueName: "Technique Name",
      descriptionLabel: "Description",
      therapists: "Therapists",
      actions: "Actions",
      view: "View",
      readMore: "Read more",
      readLess: "Read less",
      url: "URL",
      enroll: "Enroll",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      areYouSure: "Are you sure?",
      deleteWarning: "This action cannot be undone. This will permanently delete the technique.",
      cannotDelete: "Cannot delete technique",
      deactivationWarning: "This technique is associated with services or therapists and cannot be deleted.",
      registerNewTechnique: "Register New Technique",
      addNewTechnique: "Add a new therapeutic technique to the registry.",
      techniqueNameExample: "e.g., Cognitive Therapy",
      descriptionPlaceholder: "Describe the technique...",
      registering: "Registering...",
      registerTechnique: "Register Technique",
      backToTechniques: "Back to Techniques",
      techniqueDetails: "Technique Details",
      servicesUsingTechnique: "Services Using this Technique",
      noServicesFound: "No services found using this technique.",
      therapistsAssigned: "Therapists Assigned to this Technique",
      noTherapistsFound: "No therapists found assigned to this technique.",
      therapist: "Therapist",
      status: "Status",
      performance: "Performance"
    },
    sales: {
        title: "Sales",
        newSale: "New Sale",
        searchPlaceholder: "Search by patient or item...",
        noSalesFound: "No sales found.",
        date: "Date",
        patient: "Patient",
        item: "Item",
        amount: "Amount",
        registerSale: "Register Sale",
        registerSaleDescription: "Register a new sale of a service or package.",
        patientLabel: "Patient",
        selectPatientPlaceholder: "Select a patient",
        saleTypeLabel: "Sale Type",
        saleTypeService: "Service",
        saleTypePackage: "Package",
        serviceLabel: "Service",
        selectServicePlaceholder: "Select a service",
        packageLabel: "Package",
        selectPackagePlaceholder: "Select a package",
        sessionsLabel: "Number of Sessions",
        amountLabel: "Amount ($)",
        registerButton: "Register Sale",
        registeringButton: "Registering...",
        cancel: "Cancel",
        actions: "Actions"
    },
    packages: {
      title: "Packages",
      newPackage: "New Package",
      searchPlaceholder: "Search by name...",
      noPackagesFound: "No packages found.",
      packageName: "Package Name",
      description: "Description",
      price: "Price",
      services: "Services",
      actions: "Actions",
      view: "View",
      edit: "Edit",
      delete: "Delete",
      registerNewPackage: "Register New Package",
      addNewPackage: "Create a new package by bundling existing services.",
      packageNameExample: "e.g., Relaxation Package",
      descriptionPlaceholder: "Describe the contents of the package...",
      priceLabel: "Price ($)",
      servicesLabel: "Included Services",
      selectServicesPlaceholder: "Select services...",
      registering: "Registering...",
      registerPackage: "Register Package",
      cancel: "Cancel",
    },
    toasts: {
        success: {
            title: "Success",
            appointmentNotesUpdated: "Appointment notes have been updated.",
            appointmentMarkedAsDone: "Appointment has been marked as done.",
            appointmentEvaluated: (evaluation: string) => `Appointment has been ${evaluation}.`,
            appointmentScheduled: "New appointment has been scheduled.",
            patientCreated: "New patient has been created.",
            patientDetailsUpdated: "Patient details have been updated.",
            serviceRegistered: "New service has been registered.",
            serviceUpdated: "Service has been updated.",
            serviceDeleted: "Service has been deleted.",
            serviceActivated: "Service has been activated.",
            serviceDeactivated: "Service has been deactivated.",
            techniqueRegistered: "New technique has been registered.",
            techniqueUpdated: "Technique has been updated.",
            techniqueDeleted: "Technique has been deleted.",
            therapistsAssigned: "Therapists assigned successfully.",
            passwordCopied: "New password has been copied to clipboard.",
            therapistCreated: "New therapist has been created.",
            techniquesAssigned: "Techniques assigned successfully.",
            saleRegistered: "Sale has been registered successfully.",
            packageCreated: "The new package has been created.",
        },
        error: {
            title: "Error",
            actionRequired: "Action Required",
            unknown: "An unknown error occurred.",
            failedToUpdateNotes: "Failed to update notes. Please try again.",
            multiPatientCompletion: "Completing appointments with multiple patients is not yet supported in this demo.",
            completionFailed: "Completion Failed",
            failedToEvaluate: "Failed to evaluate appointment. Please try again.",
            failedToScheduleAppointment: "Failed to schedule appointment. Please try again.",
            failedToCreatePatient: "Failed to create patient. Please try again.",
            failedToUpdatePatient: "Failed to update patient details. Please try again.",
            failedToRegisterService: "Failed to register service. Please try again.",
            failedToUpdateService: "Failed to update service. Please try again.",
            failedToDeleteService: "Failed to delete service. Please try again.",
            failedToUpdateServiceStatus: "Failed to update service status.",
            failedToRegisterTechnique: "Failed to register technique. Please try again.",
            failedToUpdateTechnique: "Failed to update technique. Please try again.",
            failedToDeleteTechnique: "Failed to delete technique. Please try again.",
            failedToAssignTherapists: "Failed to assign therapists. Please try again.",
            failedToResetPassword: "Failed to reset password. Please try again.",
            failedToCreateTherapist: "Failed to create therapist. Please try again.",
            failedToAssignTechniques: "Failed to assign techniques. Please try again.",
            failedToRegisterSale: "Failed to register sale. Please try again.",
            failedToCreatePackage: "Failed to create package. Please try again.",
        }
    },
    enums: {
      appointmentStatus: {
        PROGRAMMED: "Programmed",
        DONE: "Done",
      },
      appointmentEvaluation: {
        UNDER_EVALUATION: "Under Evaluation",
        APPROVED: "Approved",
        REJECTED: "Rejected",
      },
      concurrency: {
        SINGLE: "Single",
        MULTIPLE: "Multiple",
      },
      serviceStatus: {
        ACTIVE: "Active",
        INACTIVE: "Inactive",
      },
      techniqueStatus: {
        PRACTITIONER: "Practitioner",
        THERAPIST: "Therapist",
      },
      validationStatus: {
        PENDING: "En evaluación",
        APPROVED: "Aprobada",
      }
    }
  },
};

export type Dictionary = typeof dictionaries.es;

      
