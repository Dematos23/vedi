
"use client";

import * as React from "react";
import type { Service, Technique } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { updateService, deleteService, toggleServiceStatus } from "@/lib/actions";
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
import { Power, PowerOff, Trash2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

const updateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
  techniqueIds: z.array(z.string()).min(1, "Please select at least one technique."),
});


type ServiceFormValues = z.infer<typeof updateServiceSchema>;

interface EditServiceSheetProps {
  service: Service & { techniques: Technique[] };
  allTechniques: Technique[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditServiceSheet({ service, allTechniques, open, onOpenChange }: EditServiceSheetProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [showDeactivationAlert, setShowDeactivationAlert] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.services;
  
  const isInactive = service.status === 'INACTIVE';

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      id: service.id,
      name: service.name,
      description: service.description,
      price: Number(service.price),
      duration: service.duration,
      techniqueIds: service.techniques.map(t => t.id),
    },
  });
  
  React.useEffect(() => {
    if (open) {
      form.reset({
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price),
        duration: service.duration,
        techniqueIds: service.techniques.map(t => t.id),
      });
    }
  }, [open, service, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await updateService(data);
      toast({
        title: "Success",
        description: "Service has been updated.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service. Please try again.",
      });
    }
  };
  
  const handleDeleteAttempt = async () => {
    try {
        await deleteService(service.id);
        toast({
            title: "Success",
            description: "Service has been deleted.",
        });
        setShowDeleteAlert(false);
        onOpenChange(false);
    } catch (error: any) {
        if (error.message.includes("appointments")) {
            setShowDeleteAlert(false);
            setShowDeactivationAlert(true);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete service. Please try again.",
            });
        }
    }
  }

  const handleToggleStatus = async () => {
    try {
      await toggleServiceStatus(service.id, service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
      toast({
        title: "Success",
        description: `Service has been ${isInactive ? 'activated' : 'deactivated'}.`,
      });
      onOpenChange(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status.",
      });
    }
  }

  const techniqueOptions = allTechniques.map(t => ({ value: t.id, label: t.name }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.edit} {service.name}</SheetTitle>
          <SheetDescription>
            {d.descriptionPlaceholder}
          </SheetDescription>
        </SheetHeader>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{d.serviceName}</FormLabel>
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
                  name="techniqueIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.techniques.title}</FormLabel>
                        <MultiSelect
                            options={techniqueOptions}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select techniques..."
                            className="w-full"
                        />
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
                        <FormLabel>{d.priceLabel}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
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
                        <FormLabel>{d.durationLabel}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="flex justify-between items-center pt-4">
                    <div className="flex gap-2">
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
                        <Button variant="ghost" size="icon" type="button" onClick={handleToggleStatus}>
                            {isInactive ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
                            <span className="sr-only">{isInactive ? d.activate : d.deactivate} Service</span>
                        </Button>
                    </div>
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
      {/* Deactivation Alert */}
      <AlertDialog open={showDeactivationAlert} onOpenChange={setShowDeactivationAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{d.cannotDelete}</AlertDialogTitle>
            <AlertDialogDescription>
                {d.deactivationWarning}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>{d.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
                {d.deactivate}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
