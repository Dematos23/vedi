import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-white rounded-md p-1">
        <Image
          src="/vedi-logo.png"
          alt="Vedi Logo"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </div>
      <h1 className="text-xl font-bold text-foreground">Vedi</h1>
    </div>
  );
}
