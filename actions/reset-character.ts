"use server";

import { MIN_RESET_LEVEL, POINTS_PER_RESET } from "@/constants/resets";
import { resetCharacterSchema } from "@/lib/validation/reset-character";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

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

  const { characterName } = validated.data;
  const character = await verifyCharacterOwnership(characterName);

  if (!character) {
    return { success: false, message: "Character not found." };
  }

  if ((character.cLevel ?? 0) < MIN_RESET_LEVEL) {
    return {
      success: false,
      message: `Character must be at least level ${MIN_RESET_LEVEL} to reset.`,
    };
  }

  await prisma.character.update({
    where: { Name: characterName },
    data: {
      cLevel: 1,
      ResetCount: { increment: 1 },
      LevelUpPoint: { increment: POINTS_PER_RESET },
      Experience: 0,
    },
  });

  revalidatePath(`/user-panel/${characterName}`);
  return {
    success: true,
    message: `Character reset! +${POINTS_PER_RESET} stat points granted.`,
  };
}
