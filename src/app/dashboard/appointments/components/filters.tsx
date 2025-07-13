
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import type { Service } from "@prisma/client";
import { Search as SearchIcon, ListFilter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FiltersProps {
  allServices: Service[];
}

export function Filters({ allServices }: FiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const serviceOptions = allServices.map(s => ({ value: s.id, label: s.name }));
  const initialServices = searchParams.get('services')?.split(',') || [];
  
  const [selectedServices, setSelectedServices] = React.useState<string[]>(initialServices);
  const [open, setOpen] = React.useState(false);


  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSortChange = (value: string) => {
     const params = new URLSearchParams(searchParams);
     if (value) {
        params.set("orderBy", value);
     } else {
        params.delete("orderBy");
     }
     replace(`${pathname}?${params.toString()}`);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedServices.length > 0) {
      params.set("services", selectedServices.join(','));
    } else {
      params.delete("services");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedServices, pathname, replace, searchParams]);
  

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
      <div className="relative w-full md:flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by patient or service..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
          className="pl-10"
        />
      </div>

       {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-4">
          <MultiSelect
              options={serviceOptions}
              selected={selectedServices}
              onChange={setSelectedServices}
              className="min-w-[200px]"
              placeholder="Filter by service..."
          />
          <Select 
            defaultValue={searchParams.get("orderBy") || "desc"}
            onValueChange={handleSortChange}
          >
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
          </Select>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden w-full">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] space-y-4">
                <div>
                  <Label>Filter by Service</Label>
                   <MultiSelect
                      options={serviceOptions}
                      selected={selectedServices}
                      onChange={setSelectedServices}
                      placeholder="Select services..."
                  />
                </div>
                 <div>
                    <Label>Sort by Date</Label>
                    <Select 
                        defaultValue={searchParams.get("orderBy") || "desc"}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Newest First</SelectItem>
                            <SelectItem value="asc">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </PopoverContent>
         </Popover>
      </div>
    </div>
  );
}
