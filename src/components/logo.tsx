import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M7 11.5L2.5 16l-1.4-1.4a2 2 0 0 1 0-2.8l7.8-7.8a2 2 0 0 1 2.8 0l1.4 1.4" />
        <path d="M20.5 5.5L15 11l-1-1" />
        <path d="M16 10l-2 2" />
        <path d="M12 14l-1.5 1.5" />
        <path d="m3 21 8.5-8.5" />
        <path d="M12.5 6.5L18 1" />
      </svg>
      <h1 className="text-xl font-bold text-foreground">Vedi</h1>
    </div>
  );
}
