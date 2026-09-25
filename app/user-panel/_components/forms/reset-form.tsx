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
import { CharacterSection, CharacterValues } from "../character-info";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
  RESET_COST_PER_RESET,
} from "@/constants/resets";
import { resetCharacterAction } from "@/lib/actions/reset-character";
import { type Character } from "@/lib/types/character";
import { startTransition, useActionState } from "react";

interface ResetFormProps {
  character: Character;
}

export function ResetForm({ character }: ResetFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetCharacterAction,
    {},
  );

  const resetCost = (character.resets + 1) * RESET_COST_PER_RESET;
  const hasRequiredLevel = character.level >= MIN_RESET_LEVEL;
  const isUnderResetLimit = character.resets < MAX_RESETS;
  const hasEnoughZen = character.zen >= resetCost;

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    startTransition(() => {
      formAction(formData);
    });
  };

  const requirements = [
    {
      label: "Level",
      value: `${character.level} / ${MIN_RESET_LEVEL} required`,
    },
    { label: "Resets", value: `${character.resets} / ${MAX_RESETS} maximum` },
    { label: "Zen balance", value: character.zen.toLocaleString() },
    { label: "Reset cost", value: resetCost.toLocaleString() },
  ];
  const canReset = hasRequiredLevel && isUnderResetLimit && hasEnoughZen;

  return (
    <div className="flex flex-col gap-6">
      <CharacterSection title="Reset requirements">
        <CharacterValues items={requirements} />
      </CharacterSection>
      <Separator />
      <CharacterSection title="After this reset">
        <CharacterValues
          items={[
            { label: "Level", value: 1 },
            { label: "Total resets", value: character.resets + 1 },
            { label: "Bonus stat points", value: `+${POINTS_PER_RESET}` },
            { label: "Attributes", value: "Class defaults" },
          ]}
        />
      </CharacterSection>
      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!canReset && (
        <Alert>
          <AlertDescription>
            <ul className="flex list-inside list-disc flex-col gap-2">
              {!hasRequiredLevel && (
                <li>Reach level {MIN_RESET_LEVEL} to reset.</li>
              )}
              {!isUnderResetLimit && (
                <li>You have reached the maximum of {MAX_RESETS} resets.</li>
              )}
              {!hasEnoughZen && (
                <li>
                  You need {(resetCost - character.zen).toLocaleString()} more
                  Zen.
                </li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {canReset && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Resetting restores your class’s base attributes and deducts the
            reset cost from your Zen balance.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isPending}
                className="w-full sm:w-auto sm:self-start"
              >
                Reset Character
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Character?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. Your character will return to level 1,
                  base stats will be restored, and {resetCost.toLocaleString()}{" "}
                  Zen will be deducted from your balance. You will be granted +
                  {POINTS_PER_RESET} stat points.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleConfirm}
                >
                  Confirm Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
