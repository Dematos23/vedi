
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { type Service } from "@prisma/client";
import { createPackage } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

const packageServiceSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

const createPackageSchema = z.object({
  name: z.string().min(3, "Package name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  services: z.array(packageServiceSchema).min(1, "Please add at least one service."),
});


type PackageFormValues = z.infer<typeof createPackageSchema>;

interface NewPackageFormProps {
  services: Service[];
  onFormSubmit?: () => void;
}

export function NewPackageForm({ services, onFormSubmit }: NewPackageFormProps) {
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.packages;
  const t = dictionary.toasts;

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      services: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const onSubmit = async (data: PackageFormValues) => {
    try {
      await createPackage(data);
      toast({
        title: t.success.title,
        description: t.success.packageCreated,
      });
      form.reset();
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToCreatePackage,
      });
    }
  };
  
  const currentSelectedServiceIds = fields.map(field => field.serviceId);
  const availableServices = services.filter(s => !currentSelectedServiceIds.includes(s.id));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{d.packageName}</FormLabel>
              <FormControl>
                <Input placeholder={d.packageNameExample} {...field} />
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
              <FormLabel>{d.description}</FormLabel>
              <FormControl>
                <Textarea placeholder={d.descriptionPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{d.priceLabel}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="250.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>{d.servicesLabel}</FormLabel>
          <div className="space-y-4 pt-2">
            {fields.map((field, index) => {
                const selectedService = services.find(s => s.id === form.getValues(`services.${index}.serviceId`));
                return (
                    <div key={field.id} className="flex items-end gap-2">
                        <FormField
                        control={form.control}
                        name={`services.${index}.serviceId`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder={d.selectServicesPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedService && <SelectItem key={`${index}-${selectedService.id}`} value={selectedService.id}>{selectedService.name}</SelectItem>}
                                    {availableServices.map((service) => (
                                        <SelectItem key={`${index}-${service.id}`} value={service.id}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`services.${index}.quantity`}
                        render={({ field }) => (
                            <FormItem className="w-24">
                            <FormControl>
                                <Input type="number" placeholder="Qty" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="button" variant="destructive-outline" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
             <FormMessage>{form.formState.errors.services?.message}</FormMessage>
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ serviceId: "", quantity: 1 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service to Package
              </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
            <Button variant="ghost" type="button" onClick={onFormSubmit}>
                {d.cancel}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.registering : d.registerPackage}
            </Button>
        </div>
      </form>
    </Form>
  );
}
