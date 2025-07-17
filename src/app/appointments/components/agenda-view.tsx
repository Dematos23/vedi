
"use client";

import * as React from "react";
import { format, setHours, startOfHour, getMinutes, getHours } from "date-fns";
import { es } from "date-fns/locale";
import { cn, getFullName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { useLanguage } from "@/contexts/language-context";
import type { AppointmentWithDetails } from "../page";
import type { User } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface AgendaViewProps {
  appointments: AppointmentWithDetails[];
  therapists: User[];
  searchParams: {
    therapist?: string;
    agendaDate?: string;
  };
}

const HOURS_IN_DAY = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export function AgendaView({ appointments, therapists, searchParams }: AgendaViewProps) {
  const { dictionary, locale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const d = dictionary.appointments;

  const selectedTherapist = searchParams.therapist || (therapists[0]?.id ?? "");
  const selectedDate = searchParams.agendaDate ? new Date(searchParams.agendaDate) : new Date();

  const handleTherapistChange = (therapistId: string) => {
    const params = new URLSearchParams(currentParams);
    params.set('view', 'agenda');
    params.set('therapist', therapistId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const params = new URLSearchParams(currentParams);
      params.set('view', 'agenda');
      params.set('agendaDate', date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      router.replace(`${pathname}?${params.toString()}`);
    }
  };
  
  const getEventPositionAndHeight = (appt: AppointmentWithDetails) => {
    if (!appt.service) return { top: 0, height: 0 };
    const date = new Date(appt.date);
    const startHour = getHours(date);
    const startMinute = getMinutes(date);
    
    const top = ((startHour - 8) * 60 + startMinute) * (60 / 60) ; // 1px per minute approx.
    const height = appt.service.duration * (60 / 60);

    return { top, height };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{d.agendaView}</CardTitle>
        <CardDescription>{d.agendaViewDescription}</CardDescription>
        <div className="flex flex-col md:flex-row gap-4 pt-4">
           <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
             <SelectTrigger className="w-full md:w-[250px]">
               <SelectValue placeholder={d.selectTherapist} />
             </SelectTrigger>
             <SelectContent>
                {therapists.map(t => (
                  <SelectItem key={t.id} value={t.id}>{getFullName(t)}</SelectItem>
                ))}
             </SelectContent>
           </Select>
           <DatePicker date={selectedDate} setDate={handleDateChange} className="w-full md:w-[250px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[780px] overflow-y-auto">
          {/* Time slots */}
          <div className="grid">
            {HOURS_IN_DAY.map((hour) => {
               const time = setHours(new Date(), hour);
               return (
                <div key={hour} className="relative grid grid-cols-[auto_1fr] h-[60px] border-t">
                  <div className="text-right pr-2 text-xs text-muted-foreground -translate-y-2">
                    {format(time, 'p', { locale: locale === 'es' ? es : undefined })}
                  </div>
                  <div />
                </div>
               )
            })}
          </div>

          {/* Appointments */}
          <div className="absolute top-0 left-12 right-0 bottom-0">
             {appointments.map((appt) => {
              if (!appt.service) return null;
              const { top, height } = getEventPositionAndHeight(appt);
              return (
                 <Link href={`/appointments/${appt.id}`} key={appt.id} legacyBehavior>
                    <a 
                      className="absolute left-2 right-2 p-2 rounded-lg shadow-md cursor-pointer transition-colors hover:bg-primary/90"
                      style={{ 
                        top: `${top}px`, 
                        height: `${height}px`,
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))'
                      }}
                    >
                        <p className="font-semibold text-sm truncate">{appt.service.name}</p>
                        <p className="text-xs opacity-90 truncate">{appt.patients.map(p => getFullName(p)).join(', ')}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {format(new Date(appt.date), 'p', { locale: locale === 'es' ? es : undefined })}
                        </Badge>
                    </a>
                </Link>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    