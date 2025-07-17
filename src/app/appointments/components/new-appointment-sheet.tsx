
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { createAppointment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { Patient, Service } from "@prisma/client";
import { Concurrency } from "@prisma/client";
import { MultiSelect } from "@/components/ui/multi-select";
import { getFullName } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/language-context";

const appointmentSchema = z.object({
  patientIds: z.array(z.string()).min(1, "Please select at least one patient."),
  serviceId: z.string({ required_error: "Please select a service." }),
  date: z.date({ required_error: "Please select a date." }),
  concurrency: z.nativeEnum(Concurrency, { required_error: "Please select a concurrency type."}),
  description: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface NewAppointmentSheetProps {
  patients: Patient[];
  services: Service[];
}

export function NewAppointmentSheet({ patients, services }: NewAppointmentSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.appointments;

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date(),
      description: '',
      patientIds: [],
      serviceId: undefined,
      concurrency: Concurrency.SINGLE,
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      await createAppointment(data);
      toast({
        title: "Success",
        description: "New appointment has been scheduled.",
      });
      setOpen(false);
      form.reset({
         date: new Date(),
         patientIds: [],
         serviceId: undefined,
         description: '',
         concurrency: Concurrency.SINGLE
      });
    } catch (error) {
       let message = "Failed to schedule appointment. Please try again.";
       if (error instanceof Error) {
           message = error.message;
       }
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  const activeServices = services.filter(s => s.status === 'ACTIVE');
  const patientOptions = patients.map(p => ({ value: p.id, label: getFullName(p) }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newAppointment}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{d.scheduleAppointment}</SheetTitle>
          <SheetDescription>{d.scheduleAppointmentDescription}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="patientIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.patientsLabel}</FormLabel>
                   <MultiSelect
                      options={patientOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={d.selectPatientsPlaceholder}
                      className="w-full"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.serviceLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={d.selectServicePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{d.dateLabel}</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="concurrency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{d.concurrencyLabel}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Concurrency.SINGLE} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {d.single}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Concurrency.MULTIPLE} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {d.multiple}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.descriptionLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={d.descriptionPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.schedulingButton : d.scheduleButton}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
