
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth, endOfMonth } from 'date-fns';
import { AppointmentStatus, type Service } from "@prisma/client";
import { DashboardClient, type DashboardData } from "./components/dashboard-client";

export default async function DashboardPage() {
  const totalPatients = await prisma.patient.count();
  const totalServices = await prisma.service.count();
  const upcomingAppointmentsCount = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date(),
      },
      status: AppointmentStatus.PROGRAMMED,
    },
  });
  
  const services: Service[] = await prisma.service.findMany();

  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  const currentMonthSales = await prisma.sale.aggregate({
    where: {
      date: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
    _sum: {
      amount: true,
    }
  });
  
  const totalSalesCurrentMonth = currentMonthSales._sum.amount || 0;

  const dashboardData: DashboardData = {
    totalPatients,
    totalServices,
    upcomingAppointmentsCount,
    totalSalesCurrentMonth: formatCurrency(totalSalesCurrentMonth),
    services,
  };


  return (
    <DashboardClient data={dashboardData} />
  );
}
