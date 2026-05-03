import { ITEM_ICONS_ROOT } from "./constants";
import { buildItemIconGifFileName } from "./files";
import { getCategoryFolderForGroup } from "./folders";
import { ItemIconPathOptions } from "./types";
import { getVariantDigitsForItemIcon } from "./variant-digits";

export type { ItemIconPathOptions } from "./types";

/** Root-relative URL segment for `public/images/items/...` (use as `<img src>`). */
export const getItemIconPath = (
  itemGroup: number,
  itemIndex: number,
  options?: ItemIconPathOptions,
): string => {
  const variantDigits = getVariantDigitsForItemIcon(
    itemGroup,
    itemIndex,
    options,
  );
  const fileName = buildItemIconGifFileName(
    itemGroup,
    itemIndex,
    variantDigits,
  );
  const folder = getCategoryFolderForGroup(itemGroup);
  return `${ITEM_ICONS_ROOT}/${folder}/${fileName}`;
};
