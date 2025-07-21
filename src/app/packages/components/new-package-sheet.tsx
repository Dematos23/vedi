
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
import { useLanguage } from "@/contexts/language-context";
import { type Service } from "@prisma/client";
import { NewPackageForm } from "./new-package-form";

interface NewPackageSheetProps {
    services: Service[];
}

export function NewPackageSheet({ services }: NewPackageSheetProps) {
  const [open, setOpen] = React.useState(false);
  const { dictionary } = useLanguage();
  const d = dictionary.packages;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {d.newPackage}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{d.registerNewPackage}</SheetTitle>
          <SheetDescription>
            {d.addNewPackage}
          </SheetDescription>
        </SheetHeader>
        <NewPackageForm services={services} onFormSubmit={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
