
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
import { useLanguage } from "@/contexts/language-context";
import type { Technique } from "@prisma/client";

interface NewServiceSheetProps {
    techniques: Technique[];
}

export function NewServiceSheet({ techniques }: NewServiceSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { dictionary } = useLanguage();
  const d = dictionary.services;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newService}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.registerNewService}</SheetTitle>
          <SheetDescription>
            {d.addNewService}
          </SheetDescription>
        </SheetHeader>
        <NewServiceForm techniques={techniques} onFormSubmit={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
