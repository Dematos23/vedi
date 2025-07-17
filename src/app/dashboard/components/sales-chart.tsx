
"use client";

import * as React from "react";
import { format, startOfDay } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DateRange } from "react-day-picker";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChartData } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

type TimeUnit = "day" | "week" | "month" | "year";

export function SalesChart() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfDay(new Date(new Date().getFullYear(), 0, 1)),
    to: new Date(),
  });
  const [timeUnit, setTimeUnit] = React.useState<TimeUnit>("month");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      if (dateRange?.from && dateRange?.to) {
        setLoading(true);
        const chartData = await getChartData({
            startDate: dateRange.from,
            endDate: dateRange.to,
            timeUnit,
            model: 'sale', // Now fetches from sales
            aggregateBy: 'sum'
        });
        setData(chartData);
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange, timeUnit]);
  
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), timeUnit === 'day' ? 'MMM d' : 'MMM yyyy'),
    sales: Number(item.total)
  }));


  return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Track revenue over a selected period.
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
          </div>
           {loading ? (
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
                    tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                        }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
           )}
        </CardContent>
      </Card>
  );
}
