
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import type { Service, AppointmentStatus } from "@prisma/client";
import { Search as SearchIcon, ListFilter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
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

  const handleDateRangeChange = (value: string) => {
     const params = new URLSearchParams(searchParams);
     if (value && value !== 'all') {
        params.set("dateRange", value);
     } else {
        params.delete("dateRange");
     }
     replace(`${pathname}?${params.toString()}`);
  };

  const handleServiceChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("service", value);
    } else {
      params.delete("service");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'ALL') {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  }

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
          <Select
            defaultValue={searchParams.get("status") || "PROGRAMMED"}
            onValueChange={handleStatusChange}
          >
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PROGRAMMED">Programmed</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
          </Select>
          <Combobox
              options={serviceOptions}
              value={searchParams.get("service") || ""}
              onChange={handleServiceChange}
              placeholder="Filter by service..."
              className="min-w-[200px]"
          />
          <Select 
            defaultValue={searchParams.get("dateRange") || "all"}
            onValueChange={handleDateRangeChange}
          >
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="next_month">Next Month</SelectItem>
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
                    <Label>Filter by Status</Label>
                    <Select
                      defaultValue={searchParams.get("status") || "PROGRAMMED"}
                      onValueChange={handleStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PROGRAMMED">Programmed</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                <div>
                  <Label>Filter by Service</Label>
                   <Combobox
                      options={serviceOptions}
                      value={searchParams.get("service") || ""}
                      onChange={(value) => {
                        handleServiceChange(value);
                        setOpen(false);
                      }}
                      placeholder="Select a service..."
                  />
                </div>
                 <div>
                    <Label>Filter by Date</Label>
                    <Select 
                        defaultValue={searchParams.get("dateRange") || "all"}
                        onValueChange={handleDateRangeChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this_week">This Week</SelectItem>
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="this_year">This Year</SelectItem>
                            <SelectItem value="next_month">Next Month</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </PopoverContent>
         </Popover>
      </div>
    </div>
  );
}
