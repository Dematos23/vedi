
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
  CardDescription,
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

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
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
            <div className="grid gap-2">
              {isEditing ? (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
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
                  {isInactive && <Badge variant="destructive">Inactive</Badge>}
                </div>
              )}
            </div>
            {!isEditing && (
              <div className="flex gap-1">
                 <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-5 w-5" />
                  <span className="sr-only">Edit Service</span>
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
                      <FormLabel>Description</FormLabel>
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
                        <FormLabel>Price ($)</FormLabel>
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
                        <FormLabel>Duration (min)</FormLabel>
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
                    <p className="font-semibold text-lg">{formatCurrency(service.price)}</p>
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
                                    <span className="sr-only">Delete Service</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the service.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAttempt}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="ghost" size="icon" type="button" onClick={handleToggleStatus}>
                            {isInactive ? <Power className="h-5 w-5" /> : <PowerOff className="h-5 w-5" />}
                            <span className="sr-only">{isInactive ? 'Activate' : 'Deactivate'} Service</span>
                        </Button>
                    </div>
                  <Button variant="ghost" type="button" onClick={handleCancel} disabled={form.formState.isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </>
             ) : (
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/services/${service.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </Link>
                </Button>
             )}
            </CardFooter>
        </form>
      </Form>
      
      {/* Deactivation Alert */}
      <AlertDialog open={showDeactivationAlert} onOpenChange={setShowDeactivationAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Cannot Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
                This service has appointments associated with it and cannot be deleted. Would you like to deactivate it instead? Deactivated services will not appear when creating new appointments.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
                Deactivate
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
