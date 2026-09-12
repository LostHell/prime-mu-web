import { cn } from "@/lib/utils";

type LabeledValueProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function LabeledValue({ label, value, highlight }: LabeledValueProps) {
  return (
    <p className="text-muted-foreground mb-0.5 text-xs">
      {label}:{" "}
      <span
        className={cn(
          "text-sm font-semibold",
          highlight ? "text-gold" : "text-foreground",
        )}
      >
        {value}
      </span>
    </p>
  );
}
