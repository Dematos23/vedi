
"use client";
import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

type Option = Record<"value" | "label", string>;

interface MultiSelectProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  options: Option[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select options...",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = React.useCallback(
    (optionValue: string) => {
      onChange(selected.filter((s) => s !== optionValue));
    },
    [onChange, selected]
  );

  const handleSelect = (optionValue: string) => {
    if (selected.includes(optionValue)) {
        handleUnselect(optionValue);
    } else {
        onChange([...selected, optionValue]);
    }
  };

  return (
    <Command
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.currentTarget.blur();
        }
      }}
      className={cn("w-full", className)}
      {...props}
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="relative flex min-h-[2.5rem] flex-wrap items-center gap-1">
          {selected.length > 0 ? (
            options
              .filter((option) => selected.includes(option.value))
              .map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {option.label}
                  <button
                    aria-label={`Remove ${option.label} option`}
                    aria-roledescription="button to remove option"
                    type="button"
                    className="flex items-center justify-center rounded-full bg-background p-0.5 text-primary hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUnselect(option.value);
                    }}
                  >
                    <X className="h-3 w-3" strokeWidth={2} />
                  </button>
                </Badge>
              ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <CommandPrimitive.Input
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground"
            placeholder=""
          />
        </div>
      </div>
      <div className="relative">
        {open && (
          <CommandList className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => handleSelect(option.value)}
                  className={"cursor-pointer " + (selected.includes(option.value) ? "font-bold" : "")}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </div>
    </Command>
  );
}

