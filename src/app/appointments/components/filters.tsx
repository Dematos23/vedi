
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import type { Service } from "@prisma/client";
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
import { useLanguage } from "@/contexts/language-context";

interface FiltersProps {
  allServices: Service[];
}

export function Filters({ allServices }: FiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { dictionary } = useLanguage();
  const d = dictionary.appointments;

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
          placeholder={d.searchPlaceholder}
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
                  <SelectValue placeholder={d.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="ALL">{d.allStatuses}</SelectItem>
                  <SelectItem value="PROGRAMMED">{d.programmed}</SelectItem>
                  <SelectItem value="DONE">{d.done}</SelectItem>
              </SelectContent>
          </Select>
          <Combobox
              options={serviceOptions}
              value={searchParams.get("service") || ""}
              onChange={handleServiceChange}
              placeholder={d.filterByService}
              className="min-w-[200px]"
          />
          <Select 
            defaultValue={searchParams.get("dateRange") || "all"}
            onValueChange={handleDateRangeChange}
          >
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={d.filterByDate} />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">{d.all}</SelectItem>
                  <SelectItem value="today">{d.today}</SelectItem>
                  <SelectItem value="this_week">{d.thisWeek}</SelectItem>
                  <SelectItem value="this_month">{d.thisMonth}</SelectItem>
                  <SelectItem value="this_year">{d.thisYear}</SelectItem>
                  <SelectItem value="next_month">{d.nextMonth}</SelectItem>
              </SelectContent>
          </Select>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden w-full">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <ListFilter className="mr-2 h-4 w-4" />
                    {d.filters}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] space-y-4">
                 <div>
                    <Label>{d.filterByStatus}</Label>
                    <Select
                      defaultValue={searchParams.get("status") || "PROGRAMMED"}
                      onValueChange={handleStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={d.filterByStatus} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">{d.allStatuses}</SelectItem>
                            <SelectItem value="PROGRAMMED">{d.programmed}</SelectItem>
                            <SelectItem value="DONE">{d.done}</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                <div>
                  <Label>{d.filterByService}</Label>
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
                    <Label>{d.filterByDate}</Label>
                    <Select 
                        defaultValue={searchParams.get("dateRange") || "all"}
                        onValueChange={handleDateRangeChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={d.filterByDate} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{d.all}</SelectItem>
                            <SelectItem value="today">{d.today}</SelectItem>
                            <SelectItem value="this_week">{d.thisWeek}</SelectItem>
                            <SelectItem value="this_month">{d.thisMonth}</SelectItem>
                            <SelectItem value="this_year">{d.thisYear}</SelectItem>
                            <SelectItem value="next_month">{d.nextMonth}</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </PopoverContent>
         </Popover>
      </div>
    </div>
  );
}
