
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
import { createTechnique } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

const techniqueSchema = z.object({
  name: z.string().min(3, "Technique name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  requiredSessionsForTherapist: z.coerce.number().int().positive("Required sessions must be a positive integer."),
  url: z.string().url("Please enter a valid URL."),
});

type TechniqueFormValues = z.infer<typeof techniqueSchema>;

interface NewTechniqueFormProps {
  onFormSubmit?: () => void;
}

export function NewTechniqueForm({ onFormSubmit }: NewTechniqueFormProps) {
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;
  const t = dictionary.toasts;

  const form = useForm<TechniqueFormValues>({
    resolver: zodResolver(techniqueSchema),
    defaultValues: {
      name: "",
      description: "",
      requiredSessionsForTherapist: 10,
      url: "",
    },
  });

  const onSubmit = async (data: TechniqueFormValues) => {
    try {
      await createTechnique(data);
      toast({
        title: t.success.title,
        description: t.success.techniqueRegistered,
      });
      form.reset();
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t.error.failedToRegisterTechnique;
      toast({
        variant: "destructive",
        title: t.error.title,
        description: message,
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
              <FormLabel>{d.techniqueName}</FormLabel>
              <FormControl>
                <Input placeholder={d.techniqueNameExample} {...field} />
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
                <Textarea placeholder={d.descriptionPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="requiredSessionsForTherapist"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Required Sessions for Therapist</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{d.url}</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.registering : d.registerTechnique}
            </Button>
        </div>
      </form>
    </Form>
  );
}
