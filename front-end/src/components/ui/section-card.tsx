import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(12,18,34,0.35)] backdrop-blur",
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4 space-y-1">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
