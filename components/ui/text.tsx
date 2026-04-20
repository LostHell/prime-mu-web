import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const textVariants = cva(
  "font-sans text-foreground",
  {
    variants: {
      variant: {
        hero: "font-serif text-5xl md:text-7xl font-bold gold-gradient-text",
        h1: "font-serif text-4xl md:text-5xl font-bold gold-gradient-text",
        h2: "font-serif text-3xl md:text-4xl font-bold gold-gradient-text",
        h3: "font-serif text-2xl md:text-3xl font-semibold gold-gradient-text",
        h4: "font-serif text-xl md:text-2xl font-semibold gold-gradient-text",
        subtitle: "text-lg md:text-xl tracking-medium uppercase text-foreground",
        small: "text-sm text-muted-foreground",
        p: "text-base md:text-lg",
      },
    },
    defaultVariants: {
      variant: "p",
    },
  }
);

type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: React.ElementType;
    children: React.ReactNode;
  };

const tagMap = {
  hero: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  subtitle: "p",
  small: "p",
  p: "p",
} as const;

const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { className, variant = "p", as, children, ...props },
  ref
) {
  const Component = as || tagMap[variant as keyof typeof tagMap] || "p";
  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(textVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Text;