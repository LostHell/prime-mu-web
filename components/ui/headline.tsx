import { cn } from "@/lib/utils";
import { HtmlHTMLAttributes } from "react";

type HeadlineProps = HtmlHTMLAttributes<HTMLDivElement>;
const Headline = ({ children, className, ...props }: HeadlineProps) => {
  return (
    <div className={cn("mb-8 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
};

export default Headline;
