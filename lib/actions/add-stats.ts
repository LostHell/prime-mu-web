"use server";

import { addStatsSchema } from "@/lib/validation/add-stats";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

export async function addStatsAction(_state: UserPanelActionState, formData: FormData): Promise<UserPanelActionState> {
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

  await prisma.character.update({
    where: { Name: characterName },
    data: {
      Strength: { increment: str },
      Dexterity: { increment: agi },
      Vitality: { increment: vit },
      Energy: { increment: ene },
      LevelUpPoint: { decrement: totalPoints },
    },
  });

  revalidatePath(`/user-panel/${characterName}`);
  return {
    success: true,
    message: `Successfully added ${totalPoints} stat points.`,
  };
}
