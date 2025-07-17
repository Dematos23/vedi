
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
import { NewTechniqueForm } from "./new-technique-form";
import { useLanguage } from "@/contexts/language-context";

export function NewTechniqueSheet() {
  const [open, setOpen] = React.useState(false);
  const { dictionary } = useLanguage();
  const d = dictionary.techniques;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newTechnique}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.registerNewTechnique}</SheetTitle>
          <SheetDescription>
            {d.addNewTechnique}
          </SheetDescription>
        </SheetHeader>
        <NewTechniqueForm onFormSubmit={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
