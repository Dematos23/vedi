
"use client";

import { useForm } from "react-hook-form";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { createPackage } from "@/lib/actions";

const createPackageSchema = z.object({
  name: z.string().min(3, "Package name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  serviceIds: z.array(z.string()).min(1, "Please select at least one service."),
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
      serviceIds: [],
    },
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

  const serviceOptions = services.map(s => ({ value: s.id, label: s.name }));

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
        <FormField
          control={form.control}
          name="serviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{d.servicesLabel}</FormLabel>
                <MultiSelect
                    options={serviceOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder={d.selectServicesPlaceholder}
                    className="w-full"
                />
              <FormMessage />
            </FormItem>
          )}
        />
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
