const SettingRows = ({
  rows,
}: {
  rows: { label: string; value: string }[];
}) => {
  return (
    <dl>
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-border/50 flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0"
        >
          <dt className="text-muted-foreground text-sm">{row.label}</dt>
          <dd className="gold-gradient-text text-right text-sm font-semibold">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default SettingRows;
