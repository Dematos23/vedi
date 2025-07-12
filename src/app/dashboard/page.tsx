import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersRound, BriefcaseMedical, CalendarDays } from "lucide-react";
import prisma from "@/lib/prisma";
import { SalesChart } from "./components/sales-chart";
import { AppointmentsChart } from "./components/appointments-chart";

export default async function DashboardPage() {
  const totalPatients = await prisma.patient.count();
  const totalServices = await prisma.service.count();
  
  const upcomingAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date(),
      },
    },
  });

  const services = await prisma.service.findMany();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              All active patients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Services
            </CardTitle>
            <BriefcaseMedical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Available therapies and services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              All upcoming appointments
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Visualize your clinic's performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sales">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="sales">
                <SalesChart />
              </TabsContent>
              <TabsContent value="appointments">
                <AppointmentsChart services={services}/>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
    </div>
  );
}
