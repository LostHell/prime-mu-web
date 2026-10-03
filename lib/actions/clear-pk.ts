"use server";

import { clearPkSchema } from "@/lib/validation/clear-pk";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import {
  getAuthenticatedUser,
  isAccountOffline,
  verifyCharacterOwnership,
} from "./utils";
import { NEUTRAL_PK_LEVEL } from "@/constants/character-rules";

export async function clearPkAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = clearPkSchema.safeParse({
    characterName: formData.get("characterName"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { characterName } = validated.data;
  const character = await verifyCharacterOwnership(characterName);

  if (!character) {
    return { success: false, message: "Character not found." };
  }

  if (!(await isAccountOffline(accountId))) {
    return {
      success: false,
      message: "Your account must be offline to clear PK status.",
    };
  }

  if (
    (character.PkCount ?? 0) === 0 &&
    (character.PkLevel ?? NEUTRAL_PK_LEVEL) <= NEUTRAL_PK_LEVEL &&
    (character.PkTime ?? 0) === 0
  ) {
    return { success: false, message: "Character has no PK kills to clear." };
  }

  const { count } = await prisma.character.updateMany({
    where: {
      Name: characterName,
      AccountID: accountId,
      PkCount: character.PkCount,
      PkLevel: character.PkLevel,
      PkTime: character.PkTime,
    },
    data: {
      PkCount: 0,
      PkLevel: NEUTRAL_PK_LEVEL,
      PkTime: 0,
    },
  });
  if (!count)
    return {
      success: false,
      message: "Character status changed. Refresh and try again.",
    };

  revalidatePath("/user-panel", "layout");
  return {
    success: true,
    message: "PK status cleared. You are no longer a Player Killer.",
  };
}
