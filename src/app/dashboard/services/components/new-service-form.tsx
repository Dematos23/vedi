
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
import { createService } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface NewServiceFormProps {
  onFormSubmit?: () => void;
}

export function NewServiceForm({ onFormSubmit }: NewServiceFormProps) {
  const { toast } = useToast();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await createService(data);
      toast({
        title: "Success",
        description: "New service has been registered.",
      });
      form.reset();
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register service. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Individual Therapy" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="150.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (min)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Registering..." : "Register Service"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
