
"use client";

import * as React from "react";
import type { Technique } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateTechnique, deleteTechnique } from "@/lib/actions";
import { useLanguage } from "@/contexts/language-context";

const techniqueSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Technique name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

type TechniqueFormValues = z.infer<typeof techniqueSchema>;

interface TechniqueCardProps {
  technique: Technique;
}

export function TechniqueCard({ technique }: TechniqueCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;

  const form = useForm<TechniqueFormValues>({
    resolver: zodResolver(techniqueSchema),
    defaultValues: {
      id: technique.id,
      name: technique.name,
      description: technique.description,
    },
  });

  const onSubmit = async (data: TechniqueFormValues) => {
    try {
      await updateTechnique(data);
      toast({
        title: "Success",
        description: "Technique has been updated.",
      });
      setIsEditing(false);
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
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: d.cannotDelete,
            description: error.message,
        });
        setShowDeleteAlert(false);
    }
  }

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex-row items-start justify-between">
            <div className={cn("grid gap-2", isEditing && "w-full")}>
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{d.techniqueName}</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-lg font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <CardTitle>{technique.name}</CardTitle>
              )}
            </div>
            {!isEditing && (
              <div className="flex gap-1">
                 <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-5 w-5" />
                  <span className="sr-only">{d.edit}</span>
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="grid gap-4">
            {isEditing ? (
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
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                {technique.description}
              </p>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="justify-end gap-2">
                <div className="flex-grow flex justify-start">
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
                </div>
              <Button variant="ghost" type="button" onClick={handleCancel} disabled={form.formState.isSubmitting}>
                {d.cancel}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? d.saving : d.save}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
