export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-sm font-serif uppercase tracking-widest mb-2"
      style={{ color: "hsl(var(--gold))" }}
    >
      {children}
    </label>
  );
}
