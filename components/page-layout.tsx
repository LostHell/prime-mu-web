import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type PageLayoutProps = HTMLAttributes<HTMLDivElement>;

const PageLayout = ({ children, className }: PageLayoutProps) => {
  return <section className={cn("py-28", className)}>{children}</section>;
};

export default PageLayout;
