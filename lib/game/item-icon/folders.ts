import { CATEGORY_FOLDER_NAMES } from "./constants";
import { clampInt } from "./utils";

type CategoryFolderName = (typeof CATEGORY_FOLDER_NAMES)[number];

export const getCategoryFolderForGroup = (
  itemGroup: number,
): CategoryFolderName => {
  const index = clampInt(itemGroup, 0, 15);
  return CATEGORY_FOLDER_NAMES[index];
};
