import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly align?: "left" | "center";
  readonly className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  align = "center",
  className,
}: PageHeaderProps) {
  const alignment = align === "left" ? "text-left" : "text-center";

  return (
    <div className={cn("space-y-3", alignment, className)}>
      <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-solv-gold/80">
        Memory Card Game
      </div>
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
      {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
