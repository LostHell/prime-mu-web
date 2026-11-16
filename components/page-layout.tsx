import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const pageLayoutVariants = cva("mx-auto", {
  variants: {
    variant: {
      /** Public marketing / content pages (rankings, download, home sections). */
      public: "max-w-5xl pt-8 pb-16 px-4",
      /** Narrow auth flows (login, register). */
      auth: "max-w-md pt-12 pb-16 px-4",
      /** User-panel pages (`app/user-panel/_components/user-panel-shell.tsx`). */
      panel: "max-w-5xl py-8 px-4",
    },
  },
  defaultVariants: {
    variant: "public",
  },
});

type PageLayoutProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof pageLayoutVariants> & {
    /**
     * Render as a different element. Defaults to `section`. Never `main`: the
     * root layout already wraps every page in `<main>`.
     */
    as?: "section" | "div";
  };

const PageLayout = ({
  children,
  className,
  variant,
  as: Component = "section",
  ...props
}: PageLayoutProps) => {
  return (
    <Component
      className={cn(pageLayoutVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default PageLayout;
