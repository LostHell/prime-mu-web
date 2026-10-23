import { ITEM_ICONS_ROOT } from "./constants";
import { buildItemIconBaseName } from "./files";
import { pngItemIconCodes } from "./png-files";
import { getCategoryFolderForGroup } from "./folders";
import { ItemIconPathOptions } from "./types";
import { getVariantDigitsForItemIcon } from "./variant-digits";

export type { ItemIconPathOptions } from "./types";

/** Root-relative URL for an item icon. PNGs use the original numeric GIF basename. */
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
  const baseName = buildItemIconBaseName(itemGroup, itemIndex, variantDigits);
  const folder = getCategoryFolderForGroup(itemGroup);
  const group = Number(baseName.slice(0, 2));
  const code = Number(baseName.slice(2));
  const extension = pngItemIconCodes[group]?.has(code) ? "png" : "gif";
  return `${ITEM_ICONS_ROOT}/${folder}/${baseName}.${extension}`;
};
