export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export const getPageNumber = (value: string | string[] | undefined) => {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const number = Number(value);
  return Number.isSafeInteger(number) ? number : 1;
};

export const getSearchQuery = (
  value: string | string[] | undefined,
  maxLength: number,
) => (typeof value === "string" ? value.trim().slice(0, maxLength) : "");
