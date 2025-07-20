
"use client";

import * as React from "react";
import type { Technique } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { updateTechnique, deleteTechnique } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const techniqueSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Technique name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  requiredSessionsForTherapist: z.coerce.number().int().positive("Required sessions must be a positive integer."),
  url: z.string().url("Please enter a valid URL."),
});

type TechniqueFormValues = z.infer<typeof techniqueSchema>;

interface EditTechniqueSheetProps {
  technique: Technique;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTechniqueSheet({ technique, open, onOpenChange }: EditTechniqueSheetProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;
  const router = useRouter();

  const form = useForm<TechniqueFormValues>({
    resolver: zodResolver(techniqueSchema),
    defaultValues: {
      id: technique.id,
      name: technique.name,
      description: technique.description,
      requiredSessionsForTherapist: technique.requiredSessionsForTherapist,
      url: technique.url,
    },
  });
  
  React.useEffect(() => {
    if (open) {
      form.reset({
        id: technique.id,
        name: technique.name,
        description: technique.description,
        requiredSessionsForTherapist: technique.requiredSessionsForTherapist,
        url: technique.url,
      });
    }
  }, [open, technique, form]);

  const onSubmit = async (data: TechniqueFormValues) => {
    try {
      await updateTechnique(data);
      toast({
        title: "Success",
        description: "Technique has been updated.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update technique. Please try again.",
      });
    }
  };
  
  const handleDeleteAttempt = async () => {
    try {
        await deleteTechnique(technique.id);
        toast({
            title: "Success",
            description: "Technique has been deleted.",
        });
        setShowDeleteAlert(false);
        onOpenChange(false);
        router.push('/techniques');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to delete technique. Please try again.",
        });
    }
  }


  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.edit} {technique.name}</SheetTitle>
        </SheetHeader>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{d.techniqueName}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
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
                        <Input type="number" {...field} />
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
                 <div className="flex justify-between items-center pt-4">
                    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive-outline" size="icon" type="button">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">{d.delete}</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{d.areYouSure}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {d.deleteWarning}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{d.cancel}</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAttempt}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {d.delete}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex gap-2">
                        <Button variant="ghost" type="button" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
                            {d.cancel}
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? d.saving : d.save}
                        </Button>
                    </div>
                </div>
            </form>
         </Form>
      </SheetContent>
    </Sheet>
    </>
  );
}
