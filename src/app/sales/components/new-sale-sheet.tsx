
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSale } from "@/lib/actions";
import { useLanguage } from "@/contexts/language-context";
import type { Patient, Service, Package } from "@prisma/client";
import { getFullName } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const saleSchema = z.object({
  patientId: z.string({ required_error: "Patient is required." }),
  saleType: z.enum(["service", "package"], { required_error: "Sale type is required."}),
  serviceId: z.string().optional(),
  packageId: z.string().optional(),
  sessions: z.coerce.number().int().positive().optional(),
  amount: z.coerce.number().positive("Amount must be a positive number."),
}).refine(data => {
    if (data.saleType === 'service') return !!data.serviceId && !!data.sessions;
    if (data.saleType === 'package') return !!data.packageId;
    return false;
}, {
    message: "Please select a service and session count, or a package.",
    path: ["serviceId"], // This path will show the error message under the service field
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface NewSaleSheetProps {
    patients: Patient[];
    services: Service[];
    packages: Package[];
}

export function NewSaleSheet({ patients, services, packages }: NewSaleSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.sales;
  const t = dictionary.toasts;

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      patientId: undefined,
      saleType: "service",
      sessions: 5, // Default to a package of 5
    }
  });

  const saleType = useWatch({ control: form.control, name: "saleType" });
  const selectedServiceId = useWatch({ control: form.control, name: "serviceId" });
  const selectedPackageId = useWatch({ control: form.control, name: "packageId" });
  const sessionCount = useWatch({ control: form.control, name: "sessions" });

  React.useEffect(() => {
    if (saleType === "service") {
        form.setValue("packageId", undefined);
        const service = services.find(s => s.id === selectedServiceId);
        if (service && sessionCount) {
            // Let's assume a 10% discount for a package of 5, 15% for 10
            let discount = 0;
            if(sessionCount >= 10) discount = 0.15;
            else if (sessionCount >= 5) discount = 0.10;
            const finalPrice = Number(service.price) * sessionCount * (1 - discount);
            form.setValue("amount", parseFloat(finalPrice.toFixed(2)));
        }
    }
    if (saleType === "package") {
        form.setValue("serviceId", undefined);
        form.setValue("sessions", undefined);
        const pkg = packages.find(p => p.id === selectedPackageId);
        if (pkg) {
            form.setValue("amount", Number(pkg.price));
        }
    }
  }, [saleType, selectedServiceId, selectedPackageId, sessionCount, services, packages, form]);

  const onSubmit = async (data: SaleFormValues) => {
    try {
      await createSale(data);
      toast({
        title: t.success.title,
        description: t.success.saleRegistered,
      });
      setOpen(false);
      form.reset({
        patientId: undefined,
        saleType: "service",
        sessions: 5,
        amount: undefined,
        serviceId: undefined,
        packageId: undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t.error.unknown;
      toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToRegisterSale,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newSale}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{d.registerSale}</SheetTitle>
          <SheetDescription>{d.registerSaleDescription}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.patientLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={d.selectPatientPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {getFullName(p)}
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
              name="saleType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{d.saleTypeLabel}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="service" /></FormControl>
                        <FormLabel className="font-normal">{d.saleTypeService}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="package" /></FormControl>
                        <FormLabel className="font-normal">{d.saleTypePackage}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {saleType === 'service' && (
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{d.serviceLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={d.selectServicePlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                            {services.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="sessions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{d.sessionsLabel}</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
            
            {saleType === 'package' && (
                 <FormField
                    control={form.control}
                    name="packageId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{d.packageLabel}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={d.selectPackagePlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {packages.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            )}
            
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{d.amountLabel}</FormLabel>
                        <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <SheetFooter>
                <Button variant="ghost" type="button" onClick={() => setOpen(false)}>{d.cancel}</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.registeringButton : d.registerButton}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
