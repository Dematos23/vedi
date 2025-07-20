
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
import { getFullName } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import type { UserForAssignment } from "../page";
import { assignTherapistsToTechnique } from "@/lib/actions";


const assignSchema = z.object({
  therapistIds: z.array(z.string()).min(1, "Please select at least one therapist."),
});

type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignTherapistsSheetProps {
  techniqueId: string;
  availableTherapists: UserForAssignment[];
}

export function AssignTherapistsSheet({ techniqueId, availableTherapists }: AssignTherapistsSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;
  const t = dictionary.toasts;

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      therapistIds: [],
    },
  });

  const onSubmit = async (data: AssignFormValues) => {
    try {
      await assignTherapistsToTechnique(techniqueId, data.therapistIds);
      toast({
        title: t.success.title,
        description: t.success.therapistsAssigned,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error.title,
        description: t.error.failedToAssignTherapists,
      });
    }
  };

  const therapistOptions = availableTherapists.map(t => ({ value: t.id, label: getFullName(t) }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Therapist
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Assign Therapists</SheetTitle>
          <SheetDescription>Select therapists to assign to this technique.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
             <FormField
              control={form.control}
              name="therapistIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Therapists</FormLabel>
                   <MultiSelect
                      options={therapistOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select therapists..."
                      className="w-full"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
               <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Assigning..." : "Assign"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
