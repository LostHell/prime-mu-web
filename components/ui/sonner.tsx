"use client";

import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Sonner reads these as full CSS colors — use hsl(var(--token)), not raw theme channels. */
const toasterThemeVars = {
  "--normal-bg": "hsl(var(--popover))",
  "--normal-text": "hsl(var(--popover-foreground))",
  "--normal-border": "hsl(var(--border))",
  "--border-radius": "var(--radius-lg)",
} as React.CSSProperties;

const defaultToastClassNames: NonNullable<
  ToasterProps["toastOptions"]
>["classNames"] = {
  toast: cn(
    "bg-popover text-popover-foreground border-border shadow-lg",
    "group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground",
    /* Sonner defaults to align-items: center on the toast row */
    "!items-start",
  ),
  icon: "mt-0.5 shrink-0",
  title: "text-sm font-medium leading-snug text-popover-foreground",
  description: "text-sm leading-snug text-muted-foreground",
  actionButton:
    "bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90",
  cancelButton: "bg-muted text-muted-foreground text-sm font-medium",
  closeButton:
    "bg-popover text-popover-foreground border-border !right-0 !left-auto !translate-x-1/2",
  success: "border-l-4 border-l-online [&_[data-icon]]:text-online",
  error: "border-l-4 border-l-destructive [&_[data-icon]]:text-destructive",
  warning: "border-l-4 border-l-gold [&_[data-icon]]:text-gold",
  info: "border-l-4 border-l-accent [&_[data-icon]]:text-accent-foreground",
};

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      richColors={false}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={toasterThemeVars}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...defaultToastClassNames,
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
