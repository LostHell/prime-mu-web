"use server";

import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
  RESET_COST_PER_RESET,
} from "@/constants/resets";
import { resetCharacterSchema } from "@/lib/validation/reset-character";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

const DEFAULT_CLASS_TYPE_BY_SUBCLASS: Record<number, number> = {
  1: 0,
  17: 16,
  33: 32,
};

const ITEM_BYTE_SIZE = 10;
const EQUIPMENT_SLOT_COUNT = 12;

function hasEquippedItems(inventory: Uint8Array | null | undefined): boolean {
  if (!inventory || inventory.length === 0) {
    return false;
  }

  for (let slotIndex = 0; slotIndex < EQUIPMENT_SLOT_COUNT; slotIndex += 1) {
    const start = slotIndex * ITEM_BYTE_SIZE;
    const end = start + ITEM_BYTE_SIZE;

    if (end > inventory.length) {
      break;
    }

    const isEmptySlot = inventory
      .subarray(start, end)
      .every((byte) => byte === 0xff);
    if (!isEmptySlot) {
      return true;
    }
  }

  return false;
}

export async function resetCharacterAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = resetCharacterSchema.safeParse({
    characterName: formData.get("characterName"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const accountStatus = await prisma.mEMB_STAT.findUnique({
    where: { memb___id: accountId },
    select: { ConnectStat: true },
  });

  if (!accountStatus) {
    return {
      success: false,
      message: "Unable to verify account online status.",
    };
  }

  if ((accountStatus.ConnectStat ?? 0) !== 0) {
    return {
      success: false,
      message: "Character can be reset only while account is offline.",
    };
  }

  const { characterName } = validated.data;
  const character = await verifyCharacterOwnership(characterName);

  if (!character) {
    return { success: false, message: "Character not found." };
  }

  const currentResets = character.ResetCount ?? 0;

  if (currentResets >= MAX_RESETS) {
    return {
      success: false,
      message: `Character reached the reset limit (${MAX_RESETS}).`,
    };
  }

  if ((character.cLevel ?? 0) < MIN_RESET_LEVEL) {
    return {
      success: false,
      message: `Character must be at least level ${MIN_RESET_LEVEL} to reset.`,
    };
  }

  if (hasEquippedItems(character.Inventory)) {
    return {
      success: false,
      message:
        "Please unequip all items and move them to inventory before reset.",
    };
  }

  const resetCost = (currentResets + 1) * RESET_COST_PER_RESET;
  const currentZen = character.Money ?? 0;

  if (currentZen < resetCost) {
    return {
      success: false,
      message: `Not enough Zen. Required: ${resetCost.toLocaleString()}, available: ${currentZen.toLocaleString()}.`,
    };
  }

  const rawClass = character.Class ?? 0;
  const defaultClassId = DEFAULT_CLASS_TYPE_BY_SUBCLASS[rawClass] ?? rawClass;

  const defaultClassType = await prisma.defaultClassType.findUnique({
    where: { Class: defaultClassId },
    select: {
      Level: true,
      LevelUpPoint: true,
      Strength: true,
      Dexterity: true,
      Vitality: true,
      Energy: true,
      MapNumber: true,
      MapPosX: true,
      MapPosY: true,
    },
  });

  if (!defaultClassType) {
    return {
      success: false,
      message: "Default class points configuration not found.",
    };
  }

  const newResetCount = currentResets + 1;
  const baseClassPoints = defaultClassType.LevelUpPoint ?? 0;
  const totalPointsAfterReset =
    baseClassPoints + newResetCount * POINTS_PER_RESET;

  await prisma.character.update({
    where: { Name: characterName },
    data: {
      cLevel: defaultClassType.Level ?? 1,
      ResetCount: { increment: 1 },
      LevelUpPoint: totalPointsAfterReset,
      Strength: defaultClassType.Strength ?? 0,
      Dexterity: defaultClassType.Dexterity ?? 0,
      Vitality: defaultClassType.Vitality ?? 0,
      Energy: defaultClassType.Energy ?? 0,
      MapNumber: defaultClassType.MapNumber ?? 0,
      MapPosX: defaultClassType.MapPosX ?? 125,
      MapPosY: defaultClassType.MapPosY ?? 125,
      Money: { decrement: resetCost },
      Experience: 0,
    },
  });

  revalidatePath(`/user-panel/${characterName}`);
  return {
    success: true,
    message: `Character reset! Total points: ${totalPointsAfterReset.toLocaleString()}. ${resetCost.toLocaleString()} Zen spent.`,
  };
}
