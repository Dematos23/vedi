
"use client";

import * as React from "react";
import { format, startOfDay } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DateRange } from "react-day-picker";
import type { Service } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChartData } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelect } from "@/components/ui/multi-select";
import { useLanguage } from "@/contexts/language-context";

type TimeUnit = "day" | "week" | "month" | "year";

interface AppointmentsChartProps {
    services: Service[];
}

export function AppointmentsChart({ services }: AppointmentsChartProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [timeUnit, setTimeUnit] = React.useState<TimeUnit>("month");
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { dictionary } = useLanguage();
  const d = dictionary.dashboard;
  
  // Defer setting initial date range to the client to avoid hydration mismatch
  React.useEffect(() => {
    const today = new Date();
    setDateRange({
      from: startOfDay(new Date(today.getFullYear(), 0, 1)),
      to: today,
    });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      // Ensure dateRange is set before fetching
      if (dateRange?.from && dateRange?.to) {
        setLoading(true);
        // This chart now shows "sales count" instead of appointment count,
        // as appointments no longer have a direct price.
        const chartData = await getChartData({
            startDate: dateRange.from,
            endDate: dateRange.to,
            timeUnit,
            model: 'sale',
            serviceIds: selectedServices.length > 0 ? selectedServices : undefined,
            aggregateBy: 'count'
        });
        setData(chartData);
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange, timeUnit, selectedServices]);

  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), timeUnit === 'day' ? 'MMM d' : 'MMM yyyy'),
    count: Number(item.total)
  }));
  
  const serviceOptions = services.map(s => ({ value: s.id, label: s.name }));

  return (
      <Card>
        <CardHeader>
          <CardTitle>{d.salesCountOverview}</CardTitle>
          <CardDescription>
            {d.trackSalesCount}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
             <Select value={timeUnit} onValueChange={(value: TimeUnit) => setTimeUnit(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                </SelectContent>
            </Select>
            <div className="z-10">
              <MultiSelect
                  options={serviceOptions}
                  selected={selectedServices}
                  onChange={setSelectedServices}
                  className="min-w-[200px]"
                  placeholder="Filter by service..."
              />
            </div>
          </div>
          {loading || !dateRange ? (
             <Skeleton className="h-[350px] w-full" />
           ) : (
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                        }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
           )}
        </CardContent>
      </Card>
  );
}
