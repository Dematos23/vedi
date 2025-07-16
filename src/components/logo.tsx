import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-white rounded-md p-1">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/genkit-llm-76694.appspot.com/o/1721950462000-vedi-logo.png?alt=media&token=8e932371-2947-4977-8547-1587a8a1c6e1"
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
