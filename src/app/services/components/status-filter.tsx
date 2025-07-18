
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";

export function StatusFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { dictionary } = useLanguage();
  const d = dictionary.services;

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
        defaultValue={searchParams.get("status") || "ALL"}
        onValueChange={handleStatusChange}
    >
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={d.filterByStatus} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{d.allStatuses}</SelectItem>
        <SelectItem value="ACTIVE">{dictionary.enums.serviceStatus.ACTIVE}</SelectItem>
        <SelectItem value="INACTIVE">{dictionary.enums.serviceStatus.INACTIVE}</SelectItem>
      </SelectContent>
    </Select>
  );
}
