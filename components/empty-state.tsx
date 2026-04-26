import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";

type EmptyStateProps = {
  /** Icon component (e.g. from lucide-react). */
  icon?: LucideIcon;
  /** Optional headline. Renders as a small bold label above the description. */
  title?: React.ReactNode;
  /** Description body. Accepts any node so callers can include `<br />` line breaks. */
  description?: React.ReactNode;
  /**
   * Visual layout:
   * - `default` — circular muted background behind the icon, larger icon + spacing.
   * - `compact` — bare icon, no background, tighter spacing. Used for in-list filters.
   */
  variant?: "default" | "compact";
  /** Optional CTA / actions. */
  action?: React.ReactNode;
  className?: string;
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("py-12 text-center", className)}>
      {Icon ? (
        variant === "default" ? (
          <div className="bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon className="text-muted-foreground size-8" />
          </div>
        ) : (
          <Icon className="text-muted-foreground/50 mx-auto mb-3 size-12" />
        )
      ) : null}

      {title ? (
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
      ) : null}

      {description ? (
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
