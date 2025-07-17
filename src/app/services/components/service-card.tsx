
"use client";

import * as React from "react";
import type { Service } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { formatCurrency, cn } from "@/lib/utils";
import { Pencil, Trash2, Save, Power, PowerOff, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateService, deleteService, toggleServiceStatus } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").refine(val => (val.toString().split('.')[1] || []).length <= 2, "Price can have at most 2 decimal places."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [showDeactivationAlert, setShowDeactivationAlert] = React.useState(false);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.services;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: service.id,
      name: service.name,
      description: service.description,
      price: Number(service.price),
      duration: service.duration,
    },
  });
  
  const isInactive = service.status === 'INACTIVE';

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await updateService(data);
      toast({
        title: "Success",
        description: "Service has been updated.",
      });
      setIsEditing(false);
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
      setIsEditing(false);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status.",
      });
    }
  }

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  }

  return (
    <Card className={cn("flex flex-col", isInactive && "bg-muted/50 border-dashed")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <CardHeader className="flex-row items-start justify-between">
            <div className={cn("grid gap-2", isEditing && "w-full")}>
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{d.serviceName}</FormLabel>
                      <FormControl>
                        <Input {...field} className="text-lg font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <CardTitle>{service.name}</CardTitle>
                  {isInactive && <Badge variant="destructive">{d.inactive}</Badge>}
                </div>
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
          <CardContent className="grid gap-4 flex-grow">
            {isEditing ? (
              <>
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
              </>
            ) : (
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {service.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                    {service.duration} min
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-lg">{formatCurrency(Number(service.price))}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className={cn("justify-end gap-2", isEditing && "border-t pt-6 mt-auto")}>
             {isEditing ? (
                <>
                    <div className="flex-grow flex justify-start gap-2">
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
                  <Button variant="ghost" type="button" onClick={handleCancel} disabled={form.formState.isSubmitting}>
                    {d.cancel}
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? d.saving : d.save}
                  </Button>
                </>
             ) : (
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/services/${service.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {d.viewDetails}
                    </Link>
                </Button>
             )}
            </CardFooter>
        </form>
      </Form>
      
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
    </Card>
  );
}
