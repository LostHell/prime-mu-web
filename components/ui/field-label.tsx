import type { ReactNode } from "react";

const FieldLabel = ({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) => {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
      {children}
    </label>
  );
};

export default FieldLabel;
