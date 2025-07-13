
"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { createAppointment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { Patient, Service } from "@prisma/client";

const appointmentSchema = z.object({
  patientId: z.string({ required_error: "Please select a patient." }),
  serviceId: z.string({ required_error: "Please select a service." }),
  date: z.date({ required_error: "Please select a date." }),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
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
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date(),
      price: undefined,
      description: '',
      patientId: undefined,
      serviceId: undefined,
    },
  });

  const selectedServiceId = useWatch({
    control: form.control,
    name: "serviceId",
  });

  React.useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s.id === selectedServiceId);
      if (service) {
        form.setValue("price", Number(service.price));
      }
    } else {
      form.resetField("price");
    }
  }, [selectedServiceId, services, form]);

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
         price: undefined,
         patientId: undefined,
         serviceId: undefined,
         description: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
      });
    }
  };

  const activeServices = services.filter(s => s.status === 'ACTIVE');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Appointment
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Schedule Appointment</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new appointment.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {`${patient.name} ${patient.lastname}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="150.00"
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                        disabled={!selectedServiceId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Session details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Scheduling..." : "Schedule"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
