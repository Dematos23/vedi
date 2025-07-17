
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
});

type TechniqueFormValues = z.infer<typeof techniqueSchema>;

interface NewTechniqueFormProps {
  onFormSubmit?: () => void;
}

export function NewTechniqueForm({ onFormSubmit }: NewTechniqueFormProps) {
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;

  const form = useForm<TechniqueFormValues>({
    resolver: zodResolver(techniqueSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: TechniqueFormValues) => {
    try {
      await createTechnique(data);
      toast({
        title: "Success",
        description: "New technique has been registered.",
      });
      form.reset();
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register technique. Please try again.",
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
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.registering : d.registerTechnique}
            </Button>
        </div>
      </form>
    </Form>
  );
}
