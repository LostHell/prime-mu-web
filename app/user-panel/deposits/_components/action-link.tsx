import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

type ActionLinkProps = ComponentProps<"button">;

/** Plain-text, underlined, button-behaving link used for inline row actions. */
export function ActionLink({
  className,
  type = "button",
  ...props
}: ActionLinkProps) {
  return (
    <button
      type={type}
      className={cn(
        "decoration-muted-foreground/40 hover:text-gold hover:decoration-gold disabled:text-muted-foreground cursor-pointer text-sm font-medium underline underline-offset-4 transition-colors disabled:pointer-events-none disabled:no-underline disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
