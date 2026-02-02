import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-gradient-to-b from-solv-navy via-solv-midnight to-solv-slate text-foreground",
        className
      )}
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">{children}</div>
    </main>
  );
}
