"use server";

import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  RESET_COST_PER_RESET,
} from "@/constants/resets";
import { resetCharacterSchema } from "@/lib/validation/reset-character";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";
import {
  getBaseClass,
  getEquipmentStatus,
  getResetPoints,
} from "@/lib/game/characters/reset";

export async function resetCharacterAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  const equipment = getEquipmentStatus(character.Inventory);
  if (equipment === "unknown") {
    return {
      success: false,
      message: "Unable to verify equipped items. Please contact support.",
    };
  }
  if (equipment === "equipped") {
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
  const defaultClassId = getBaseClass(rawClass);

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

  const baseClassPoints = defaultClassType.LevelUpPoint ?? 0;
  const totalPointsAfterReset = getResetPoints(currentResets, baseClassPoints);

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

  revalidatePath("/user-panel", "layout");
  revalidatePath("/top-players");
  return {
    success: true,
    message: `Character reset! Total points: ${totalPointsAfterReset.toLocaleString()}. ${resetCost.toLocaleString()} Zen spent.`,
  };
}
