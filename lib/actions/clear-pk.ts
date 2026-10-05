"use server";

import { ActionError, actionErrorMessage } from "@/lib/errors/action-error";
import { getPkClearCost, splitPkClearPayment } from "@/lib/game/characters/pk";
import { clearPkSchema } from "@/lib/validation/clear-pk";
import { ActionState } from "@/lib/types/action-state";
import { bigIntToSafeNumber, formatNumber } from "@/lib/utils/numbers";
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

  const cost = getPkClearCost(character.PkCount ?? 0);
  const characterZen = character.Money ?? 0;
  const { fromCharacter, fromDeposit } = splitPkClearPayment(
    cost,
    characterZen,
  );

  if (fromDeposit > 0) {
    const deposit = await prisma.accountDeposit.findUnique({
      where: { AccountID: accountId },
      select: { Zen: true },
    });
    const depositZen = deposit?.Zen ?? BigInt(0);
    if (depositZen < BigInt(fromDeposit)) {
      return {
        success: false,
        message: `Not enough Zen. Required: ${formatNumber(cost)}, available: ${formatNumber(characterZen)} on the character and ${formatNumber(bigIntToSafeNumber(depositZen))} deposited.`,
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const { count } = await tx.character.updateMany({
        where: {
          Name: characterName,
          AccountID: accountId,
          PkCount: character.PkCount,
          PkLevel: character.PkLevel,
          PkTime: character.PkTime,
          Money: character.Money,
        },
        data: {
          PkCount: 0,
          PkLevel: NEUTRAL_PK_LEVEL,
          PkTime: 0,
          Money: { decrement: fromCharacter },
        },
      });
      if (!count) {
        throw new ActionError(
          "Character status changed. Refresh and try again.",
        );
      }

      if (fromDeposit > 0) {
        const { count: paid } = await tx.accountDeposit.updateMany({
          where: { AccountID: accountId, Zen: { gte: BigInt(fromDeposit) } },
          data: { Zen: { decrement: BigInt(fromDeposit) } },
        });
        if (!paid) {
          throw new ActionError(
            "Your deposited Zen changed. Refresh and try again.",
          );
        }
      }
    });
  } catch (err) {
    return {
      success: false,
      message: actionErrorMessage(err, "Failed to clear PK status."),
    };
  }

  revalidatePath("/user-panel", "layout");
  if (fromDeposit > 0) revalidatePath("/user-panel/deposits");
  return {
    success: true,
    message:
      cost > 0
        ? `PK status cleared for ${formatNumber(cost)} Zen. You are no longer a Player Killer.`
        : "PK status cleared. You are no longer a Player Killer.",
  };
}
