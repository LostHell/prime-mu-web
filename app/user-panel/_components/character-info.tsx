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
      <h2 className="text-sm font-semibold">{title}</h2>
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
