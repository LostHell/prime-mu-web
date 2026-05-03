import { type ItemDefinition } from "./types";

export const parsePositiveRequirement = (
  rawValue: string | undefined,
): number | undefined => {
  const parsedValue = parseInt(rawValue ?? "", 10);
  return parsedValue > 0 ? parsedValue : undefined;
};

export const parseClassFlags = (
  parts: string[],
  startIndex: number,
): ItemDefinition["classFlags"] | undefined => {
  if (parts.length < startIndex + 4) {
    return undefined;
  }

  return {
    dw: parseInt(parts[startIndex] ?? "", 10) || 0,
    dk: parseInt(parts[startIndex + 1] ?? "", 10) || 0,
    elf: parseInt(parts[startIndex + 2] ?? "", 10) || 0,
    mg: parseInt(parts[startIndex + 3] ?? "", 10) || 0,
  };
};
