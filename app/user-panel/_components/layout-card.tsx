import { cn } from "@/lib/utils";

interface LayoutCardProps {
  children: React.ReactNode;
  className?: string;
}
export function LayoutCard({ children, className }: LayoutCardProps) {
  return (
    <div
      className={cn(
        "md:bg-card md:border-border md:rounded-xl md:border md:p-6 md:backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
