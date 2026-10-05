"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clearPkAction } from "@/lib/actions/clear-pk";
import { getPkClearCost, splitPkClearPayment } from "@/lib/game/characters/pk";
import { formatNumber } from "@/lib/utils/numbers";
import { type Character } from "@/lib/types/character";
import {
  NEUTRAL_PK_LEVEL,
  PK_CLEAR_COST_PER_KILL,
} from "@/constants/character-rules";
import { CharacterSection, CharacterValues } from "../character-info";
import { startTransition, useActionState } from "react";

interface ClearPkFormProps {
  character: Character;
}

export function ClearPkForm({ character }: ClearPkFormProps) {
  const [state, formAction, isPending] = useActionState(clearPkAction, {});

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    startTransition(() => {
      formAction(formData);
    });
  };

  const hasPk =
    character.pkCount > 0 ||
    (character.pkLevel ?? NEUTRAL_PK_LEVEL) > NEUTRAL_PK_LEVEL ||
    (character.pkTime ?? 0) > 0;
  const cost = getPkClearCost(character.pkCount);
  const { fromCharacter, fromDeposit } = splitPkClearPayment(
    cost,
    character.zen,
  );
  const costDescription =
    fromDeposit === 0
      ? `${formatNumber(cost)} Zen will be taken from your character.`
      : fromCharacter === 0
        ? `${formatNumber(cost)} Zen will be taken from your deposited Zen.`
        : `${formatNumber(cost)} Zen will be taken: ${formatNumber(fromCharacter)} from your character and ${formatNumber(fromDeposit)} from your deposited Zen.`;

  return (
    <div className="flex flex-col gap-6">
      <CharacterSection title="Player Killer status">
        <CharacterValues
          items={[
            { label: "PK kills", value: character.pkCount },
            { label: "Clear cost", value: `${formatNumber(cost)} Zen` },
            { label: "Zen balance", value: formatNumber(character.zen) },
            { label: "Requirement", value: "Account offline" },
            {
              label: "Service status",
              value: hasPk ? "Available to clear" : "Nothing to clear",
            },
          ]}
        />
      </CharacterSection>
      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!hasPk ? (
        <Alert>
          <AlertDescription>
            Your character has no PK penalties to clear.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Disconnect from the game before continuing. This removes Player
            Killer marks and the remaining penalty timer from your character,
            allowing you to enter towns and interact with NPCs freely.
          </p>
          {cost > 0 && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Clearing costs {formatNumber(PK_CLEAR_COST_PER_KILL)} Zen per PK
              kill. Your character&apos;s Zen is used first, then your deposited
              Zen.
            </p>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isPending}
                className="w-full sm:w-auto sm:self-start"
              >
                Clear PK Status
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear PK Status?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your PK count to zero on{" "}
                  <span className="text-foreground font-medium">
                    {character.name}
                  </span>{" "}
                  and remove the Player Killer mark. This cannot be undone.
                  {cost > 0 && <> {costDescription}</>}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleConfirm}
                >
                  Confirm Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
