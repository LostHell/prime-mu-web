import { ITEM_GROUP_RANGES } from "./constants";

export const isWeaponGroup = (group: number): boolean => {
  return (
    group >= ITEM_GROUP_RANGES.weaponMin && group <= ITEM_GROUP_RANGES.weaponMax
  );
};

export const isShieldGroup = (group: number): boolean => {
  return group === ITEM_GROUP_RANGES.shield;
};

export const isArmorGroup = (group: number): boolean => {
  return (
    group >= ITEM_GROUP_RANGES.armorMin && group <= ITEM_GROUP_RANGES.armorMax
  );
};