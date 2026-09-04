import { cn } from "@/lib/utils";

type StatProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function Stat({ label, value, highlight }: StatProps) {
  return (
    <div>
      <p className="text-muted-foreground mb-0.5 text-xs">{label}</p>
      <p
        className={cn(
          "text-sm tabular-nums",
          highlight ? "text-gold font-semibold" : "font-medium",
        )}
      >
        {value}
      </p>
    </div>
  );
}
