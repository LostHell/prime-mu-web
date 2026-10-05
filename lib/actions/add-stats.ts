"use server";

import { ALLOCATABLE_STATS, STAT_LABELS } from "@/constants/character-rules";
import { getMaxStatPoint } from "@/lib/game/characters/stat-limits";
import { addStatsSchema } from "@/lib/validation/add-stats";
import { ActionState } from "@/lib/types/action-state";
import { formatNumber } from "@/lib/utils/numbers";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

export async function addStatsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = addStatsSchema.safeParse({
    characterName: formData.get("characterName"),
    str: Number(formData.get("str")) || 0,
    agi: Number(formData.get("agi")) || 0,
    vit: Number(formData.get("vit")) || 0,
    ene: Number(formData.get("ene")) || 0,
    cmd: Number(formData.get("cmd")) || 0,
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
      message: "Stats can be added only while account is offline.",
    };
  }

  const { characterName, str, agi, vit, ene, cmd } = validated.data;
  const totalPoints = str + agi + vit + ene + cmd;

  if (totalPoints === 0) {
    return { success: false, message: "No stats to add." };
  }

  const character = await verifyCharacterOwnership(characterName);
  if (!character) {
    return { success: false, message: "Character not found." };
  }

  if (totalPoints > (character.LevelUpPoint ?? 0)) {
    return { success: false, message: "Not enough free stat points." };
  }

  const resultingStats = {
    str: (character.Strength ?? 0) + str,
    agi: (character.Dexterity ?? 0) + agi,
    vit: (character.Vitality ?? 0) + vit,
    ene: (character.Energy ?? 0) + ene,
  };
  const classId = character.Class ?? 0;
  const errors = Object.fromEntries(
    ALLOCATABLE_STATS.filter(
      (stat) => resultingStats[stat] > getMaxStatPoint(classId, stat),
    ).map((stat) => [
      stat,
      [
        `${STAT_LABELS[stat]} cannot exceed ${formatNumber(getMaxStatPoint(classId, stat))}.`,
      ],
    ]),
  );
  if (Object.keys(errors).length) {
    return {
      success: false,
      errors,
      message: Object.values(errors).flat().join(" "),
    };
  }

  const { count } = await prisma.character.updateMany({
    where: {
      Name: characterName,
      AccountID: accountId,
      LevelUpPoint: character.LevelUpPoint,
      Strength: character.Strength,
      Dexterity: character.Dexterity,
      Vitality: character.Vitality,
      Energy: character.Energy,
      ResetCount: character.ResetCount,
    },
    data: {
      Strength: resultingStats.str,
      Dexterity: resultingStats.agi,
      Vitality: resultingStats.vit,
      Energy: resultingStats.ene,
      LevelUpPoint: { decrement: totalPoints },
    },
  });
  if (!count) {
    revalidatePath("/user-panel", "layout");
    return {
      success: false,
      message:
        "Your character changed while applying points. Review the refreshed values and try again.",
    };
  }

  revalidatePath("/user-panel", "layout");
  return {
    success: true,
    message: `Successfully added ${totalPoints} stat points.`,
  };
}
