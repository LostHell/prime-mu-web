"use server";

import { UserPanelActionState } from "@/lib/validation/types";
import { unstuckSchema } from "@/lib/validation/unstuck";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyCharacterOwnership } from "./utils";

export async function unstuckAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = unstuckSchema.safeParse({
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
  const character = await verifyCharacterOwnership(accountId, characterName);

  if (!character) {
    return { success: false, message: "Character not found." };
  }

  await prisma.character.update({
    where: { Name: characterName },
    data: {
      MapNumber: 0,
      MapPosX: 130,
      MapPosY: 130,
    },
  });

  revalidatePath(`/user-panel/${characterName}`);
  return {
    success: true,
    message: "Your character has been teleported to Lorencia.",
  };
}
