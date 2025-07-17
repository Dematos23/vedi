
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersRound, BriefcaseMedical, CalendarDays, DollarSign } from "lucide-react";
import { SalesChart } from "./sales-chart";
import { AppointmentsChart } from "./appointments-chart";
import { useLanguage } from "@/contexts/language-context";
import type { Service } from "@prisma/client";

export interface DashboardData {
    totalPatients: number;
    totalServices: number;
    upcomingAppointmentsCount: number;
    totalSalesCurrentMonth: string;
    services: Service[];
}

interface DashboardClientProps {
    data: DashboardData
}

export function DashboardClient({ data }: DashboardClientProps) {
    const { dictionary } = useLanguage();
    const d = dictionary.dashboard;

    return (
        <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{d.title}</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{d.totalPatients}</CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                {d.allActivePatients}
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                {d.registeredServices}
                </CardTitle>
                <BriefcaseMedical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                {d.availableServices}
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                {d.upcomingAppointments}
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{data.upcomingAppointmentsCount}</div>
                <p className="text-xs text-muted-foreground">
                {d.allUpcomingAppointments}
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{d.currentMonthSales}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalSalesCurrentMonth}</div>
                <p className="text-xs text-muted-foreground">
                {d.revenueForThisMonth}
                </p>
            </CardContent>
            </Card>
        </div>
        <Tabs defaultValue="sales">
            <TabsList>
                <TabsTrigger value="sales">{d.sales}</TabsTrigger>
                <TabsTrigger value="appointments">{d.appointments}</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
                <SalesChart />
            </TabsContent>
            <TabsContent value="appointments">
                <AppointmentsChart services={data.services}/>
            </TabsContent>
        </Tabs>
        </div>
    );
}
