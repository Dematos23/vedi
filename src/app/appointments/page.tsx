
import prisma from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, parseISO } from "date-fns";
import type { Prisma, AppointmentStatus, Appointment, Patient, Service, User, AppointmentEvaluation } from "@prisma/client";
import { AppointmentsList } from "./components/appointments-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaView } from "./components/agenda-view";
import { UserType } from "@prisma/client";

export type AppointmentWithDetails = Appointment & {
  patients: Patient[];
  service: Service | null;
  evaluation: AppointmentEvaluation | null;
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    service?: string;
    dateRange?: string;
    sort?: string;
    status?: string;
    view?: 'list' | 'agenda';
    therapist?: string;
    agendaDate?: string;
  };
}) {
  const { 
    query = "", 
    service: serviceId, 
    dateRange, 
    sort = "desc", 
    status,
    view = 'list',
    therapist: therapistId,
    agendaDate 
  } = searchParams;
  
  const getDateRange = (rangeKey: string) => {
      const now = new Date();
      switch (rangeKey) {
          case 'today':
              return { gte: startOfDay(now), lte: endOfDay(now) };
          case 'this_week':
              return { gte: startOfWeek(now), lte: endOfWeek(now) };
          case 'this_month':
              return { gte: startOfMonth(now), lte: endOfMonth(now) };
          case 'this_year':
              return { gte: startOfYear(now), lte: endOfYear(now) };
          case 'next_month':
              const nextMonth = addMonths(now, 1);
              return { gte: startOfMonth(nextMonth), lte: endOfMonth(nextMonth) };
          default:
              return {};
      }
  }

  const listDateFilter = dateRange ? getDateRange(dateRange) : {};

  // For agenda view, we use a single day filter
  const selectedAgendaDate = agendaDate ? parseISO(agendaDate) : new Date();
  const agendaDateFilter = {
    gte: startOfDay(selectedAgendaDate),
    lte: endOfDay(selectedAgendaDate)
  };

  const where: Prisma.AppointmentWhereInput = {
    ...(query && {
      OR: [
        { patients: { some: { name: { contains: query, mode: "insensitive" } } } },
        { patients: { some: { lastname: { contains: query, mode: "insensitive" } } } },
        { service: { name: { contains: query, mode: "insensitive" } } },
      ],
    }),
    ...(serviceId && {
      serviceId: serviceId,
    }),
  };

  if (view === 'list') {
      if (dateRange) {
        where.date = listDateFilter;
      }
      if (status && status !== 'ALL') {
        where.status = status as AppointmentStatus;
      } else if (!status) {
        where.status = 'PROGRAMMED';
      }
  } else {
    // Agenda View filtering
    where.date = agendaDateFilter;
    if (therapistId) {
      // Find all patients for the therapist and filter appointments for those patients
      const therapistPatients = await prisma.patient.findMany({
        where: { userId: therapistId },
        select: { id: true },
      });
      const patientIds = therapistPatients.map(p => p.id);
      if (patientIds.length > 0) {
        where.patients = { some: { id: { in: patientIds } } };
      } else {
        // If therapist has no patients, they have no appointments
        where.id = { in: [] }; 
      }
    }
  }

  const appointments: AppointmentWithDetails[] = await prisma.appointment.findMany({
    where,
    include: {
      patients: true,
      service: true,
    },
    orderBy: {
      date: sort === 'asc' ? 'asc' : 'desc',
    },
  });

  const allPatients = await prisma.patient.findMany();
  const allServices = await prisma.service.findMany();
  const allTherapists = await prisma.user.findMany({ where: { type: UserType.THERAPIST } });

  const listAppointments = view === 'list' ? appointments : [];
  const agendaAppointments = view === 'agenda' ? appointments : [];

  return (
    <Tabs defaultValue={view} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="agenda">Agenda View</TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <AppointmentsList
          appointments={listAppointments}
          allPatients={allPatients}
          allServices={allServices}
          searchParams={searchParams}
        />
      </TabsContent>
      <TabsContent value="agenda">
         <AgendaView
          appointments={agendaAppointments}
          therapists={allTherapists}
          searchParams={searchParams}
        />
      </TabsContent>
    </Tabs>
  );
}
