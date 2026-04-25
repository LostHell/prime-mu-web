"use server";

import { clearPkSchema } from "@/lib/validation/clear-pk";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

export async function clearPkAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
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

  if ((character.PkCount ?? 0) === 0) {
    return { success: false, message: "Character has no PK kills to clear." };
  }

  await prisma.character.update({
    where: { Name: characterName },
    data: {
      PkCount: 0,
      PkLevel: 0,
    },
  });

  revalidatePath(`/user-panel/${characterName}`);
  return {
    success: true,
    message: "PK status cleared. You are no longer a Player Killer.",
  };
}
