
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Copy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { createTherapist } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getFullName } from "@/lib/utils";

const therapistSchema = z.object({
  name: z.string().min(2, "Name is required."),
  lastname: z.string().min(2, "Last name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
});

type TherapistFormValues = z.infer<typeof therapistSchema>;

export function NewTherapistSheet() {
  const [open, setOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState<string | null>(null);
  const [createdTherapistName, setCreatedTherapistName] = React.useState<string | null>(null);
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const d = dictionary.therapists;
  const t = dictionary.toasts;

  const form = useForm<TherapistFormValues>({
    resolver: zodResolver(therapistSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: TherapistFormValues) => {
    try {
      const result = await createTherapist(data);
      toast({
        title: t.success.title,
        description: t.success.therapistCreated,
      });
      setOpen(false);
      form.reset();
      setNewPassword(result.newPassword);
      setCreatedTherapistName(getFullName(result.user));
    } catch (error) {
      const message = error instanceof Error ? error.message : t.error.failedToCreateTherapist;
      toast({
        variant: "destructive",
        title: t.error.title,
        description: message,
      });
    }
  };
  
  const copyToClipboard = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      toast({
        title: t.success.title,
        description: t.success.passwordCopied,
      });
    }
  };

  const closePasswordDialog = () => {
      setNewPassword(null);
      setCreatedTherapistName(null);
  }

  return (
    <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newTherapist}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.newTherapist}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.name}</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.email}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{d.phone}</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Creating..." : "Create Therapist"}
                </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
    
     <AlertDialog open={!!newPassword} onOpenChange={(open) => !open && closePasswordDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{d.passwordDialogTitle(createdTherapistName || '')}</AlertDialogTitle>
          <AlertDialogDescription>
            {d.passwordDialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="relative rounded-lg bg-muted p-4 font-mono text-sm">
            {newPassword}
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
            </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={closePasswordDialog}>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
