import { HTMLAttributes } from "react";

const OrnamentLine = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={className}
      style={{
        height: "1px",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, hsl(var(--gold-dim)), transparent)",
      }}
    />
  );
}

export default OrnamentLine;