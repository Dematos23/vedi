
"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NewServiceForm } from "./new-service-form";

export function NewServiceSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Service
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Register New Service</SheetTitle>
          <SheetDescription>
            Add a new therapy or service to the registry.
          </SheetDescription>
        </SheetHeader>
        <NewServiceForm onFormSubmit={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
