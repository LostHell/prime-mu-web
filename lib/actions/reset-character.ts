"use server";

import { flattenError } from "zod";
import { MAX_RESETS } from "@/constants/resets";
import { resetCharacterSchema } from "@/lib/validation/reset-character";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  isAccountOffline,
  verifyCharacterOwnership,
} from "./utils";
import { formatNumber } from "@/lib/utils/numbers";
import { getResetCarry } from "@/lib/queries/get-reset-carry";
import {
  getBaseClass,
  getEquipmentStatus,
  getNextResetRule,
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
      errors: flattenError(validated.error).fieldErrors,
      message: "Invalid input.",
    };
  }

  if (!(await isAccountOffline(accountId))) {
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

  const nextReset = getNextResetRule(currentResets);
  if (!nextReset) {
    return {
      success: false,
      message: "Reset configuration is unavailable. Please contact support.",
    };
  }

  if ((character.cLevel ?? 0) < nextReset.level) {
    return {
      success: false,
      message: `Character must be at least level ${nextReset.level} to reset.`,
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

  const resetCost = nextReset.money;
  const currentZen = character.Money ?? 0;

  if (currentZen < resetCost) {
    return {
      success: false,
      message: `Not enough Zen. Required: ${formatNumber(resetCost)}, available: ${formatNumber(currentZen)}.`,
    };
  }

  const rawClass = character.Class ?? 0;
  const defaultClassId = getBaseClass(rawClass);

  const defaultClassType = await prisma.defaultClassType.findUnique({
    where: { Class: defaultClassId },
    select: {
      Level: true,
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

  // A class change: the first reset brings back the resets a deleted character of this name
  // left (as the game server's reset does), within the limit.
  const resetCarry =
    currentResets === 0 ? await getResetCarry(characterName) : 0;
  const resetsAfterReset = Math.min(currentResets + 1 + resetCarry, MAX_RESETS);

  const totalPointsAfterReset = getResetPoints({
    resets: resetsAfterReset - 1,
    quest: character.Quest,
    fruitAddPoint: character.FruitAddPoint,
  });

  const reset = await prisma
    .$transaction(async (tx) => {
      const { count } = await tx.character.updateMany({
        where: {
          Name: characterName,
          AccountID: accountId,
          cLevel: character.cLevel,
          ResetCount: currentResets,
          LevelUpPoint: character.LevelUpPoint,
          Strength: character.Strength,
          Dexterity: character.Dexterity,
          Vitality: character.Vitality,
          Energy: character.Energy,
          Inventory: character.Inventory,
          Quest: character.Quest,
          FruitAddPoint: character.FruitAddPoint,
          Money: { gte: resetCost },
        },
        data: {
          cLevel: defaultClassType.Level ?? 1,
          ResetCount: resetsAfterReset,
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
      if (!count) return false;
      if (resetCarry > 0) {
        // Taken once: a carry gone or changed meanwhile undoes the reset.
        const taken =
          await tx.$executeRaw`DELETE FROM ResetCarry WHERE Name = ${characterName} AND Reset = ${resetCarry}`;
        if (taken !== 1) throw new ResetCarryChanged();
      }
      return true;
    })
    .catch((error: unknown) => {
      if (error instanceof ResetCarryChanged) return false;
      throw error;
    });
  if (!reset) {
    revalidatePath("/user-panel", "layout");
    return {
      success: false,
      message:
        "Your character changed while resetting. Review the refreshed values and try again.",
    };
  }

  revalidatePath("/user-panel", "layout");
  revalidatePath("/rankings");
  return {
    success: true,
    message: `Character reset! ${resetCarry > 0 ? `Resets from the previous character are back: ${formatNumber(resetsAfterReset)} resets. ` : ""}Total points: ${formatNumber(totalPointsAfterReset)}. ${formatNumber(resetCost)} Zen spent.`,
  };
}

class ResetCarryChanged extends Error {}
