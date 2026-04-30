import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const pageLayoutVariants = cva("mx-auto", {
  variants: {
    variant: {
      /** Public marketing / content pages (top-players, download, home sections). */
      public: "max-w-5xl py-28  px-4",
      /** Narrow auth flows (login, register). */
      auth: "max-w-md py-28 px-4",
      /** User-panel pages — used inside `app/user-panel/layout.tsx`'s `<main>`. */
      panel: "max-w-5xl py-8 px-6",
    },
  },
  defaultVariants: {
    variant: "public",
  },
});

type PageLayoutProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof pageLayoutVariants> & {
    /**
     * Render as a different element. Defaults to `section`. Pass `"main"` when
     * the page layout is the outermost landmark for the route.
     */
    as?: "section" | "main" | "div";
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
