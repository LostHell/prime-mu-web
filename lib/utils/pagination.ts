export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;
export const getPageNumber = (value: string | string[] | undefined) => {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
};
