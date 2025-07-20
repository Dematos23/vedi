
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { MultiSelect } from "@/components/ui/multi-select";
import { assignTechniquesToTherapist } from "@/lib/actions";
import { type Technique } from "@prisma/client";


const assignSchema = z.object({
  techniqueIds: z.array(z.string()).min(1, "Please select at least one technique."),
});

type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignTechniqueSheetProps {
  therapistId: string;
  allTechniques: Technique[];
  assignedTechniqueIds: string[];
}

export function AssignTechniqueSheet({ therapistId, allTechniques, assignedTechniqueIds }: AssignTechniqueSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.therapists;
  const t = dictionary.toasts;

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      techniqueIds: assignedTechniqueIds,
    },
  });

  const onSubmit = async (data: AssignFormValues) => {
    try {
      await assignTechniquesToTherapist(therapistId, data.techniqueIds);
      toast({
        title: t.success.title,
        description: t.success.techniquesAssigned,
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToAssignTechniques,
      });
    }
  };

  const techniqueOptions = allTechniques.map(t => ({
      value: t.id,
      label: t.name,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          {d.assignTechnique}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.assignTechnique}</SheetTitle>
          <SheetDescription>{d.assignTechniqueDescription}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="techniqueIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.allTechniques}</FormLabel>
                   <MultiSelect
                      options={techniqueOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={d.selectTechniquesPlaceholder}
                      className="w-full"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
               <Button variant="ghost" type="button" onClick={() => setOpen(false)}>{d.cancel}</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? d.assigning : d.assign}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
