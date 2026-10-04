import Text from "@/components/ui/text";
import { type ReactNode } from "react";

export function CharacterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <Text variant="section" as="h2">
        {title}
      </Text>
      {children}
    </section>
  );
}

export function CharacterValues({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-4">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="text-muted-foreground text-sm">{label}</dt>
          <dd className="mt-1 text-sm font-semibold break-words tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
