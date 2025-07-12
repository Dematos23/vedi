
"use client";

import * as React from "react";
import type { Service } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateService, deleteService } from "@/lib/actions";

const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer."),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
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

  const handleDelete = async () => {
    try {
        await deleteService(service.id);
        toast({
            title: "Success",
            description: "Service has been deleted.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete service. Make sure it's not associated with any appointments.",
        });
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
            <div>
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
                <CardTitle>{service.name}</CardTitle>
              )}
            </div>
            {!isEditing && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-5 w-5" />
                <span className="sr-only">Edit Service</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="grid gap-4">
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
                          <Input type="number" {...field} />
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
                    <p className="text-sm text-muted-foreground mt-1">
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
          {isEditing && (
            <CardFooter className="justify-end gap-2">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive-outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Service</span>
                         </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service
                            and remove it from any associated appointments.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              <Button variant="ghost" type="button" onClick={handleCancel} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
