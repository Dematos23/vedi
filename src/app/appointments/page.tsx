
import prisma from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from "date-fns";
import type { Prisma, AppointmentStatus, Appointment, Patient, Service } from "@prisma/client";
import { AppointmentsList } from "./components/appointments-list";

export type AppointmentWithDetails = Appointment & {
  patients: Patient[];
  service: Service | null;
};

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

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    service?: string;
    dateRange?: string;
    sort?: string;
    status?: string;
  };
}) {
  const { query = "", service: serviceId, dateRange, sort = "desc", status = "PROGRAMMED" } = searchParams;
  
  const dateFilter = dateRange ? getDateRange(dateRange) : {};

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
    ...(dateRange && {
        date: dateFilter,
    }),
  };

  if (status && status !== 'ALL') {
    where.status = status as AppointmentStatus;
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

  return (
    <AppointmentsList
      appointments={appointments}
      allPatients={allPatients}
      allServices={allServices}
      searchParams={searchParams}
    />
  );
}
