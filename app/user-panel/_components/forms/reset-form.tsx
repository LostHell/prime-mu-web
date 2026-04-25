"use client";

import ConfirmAction from "@/components/ui/confirm-action";
import Feedback from "@/components/ui/feedback";
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

  const statsData = [
    { label: "Current Resets", value: character.resets },
    { label: "Max Resets", value: MAX_RESETS },
    { label: "Current Level", value: character.level },
    { label: "Required Level", value: MIN_RESET_LEVEL },
    { label: "Current Zen", value: character.zen.toLocaleString() },
    { label: "Reset Cost", value: resetCost.toLocaleString() },
    { label: "Points per Reset", value: `+${POINTS_PER_RESET}` },
    { label: "Level after Reset", value: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {statsData.map(({ label, value }) => (
          <div
            key={label}
            className="border-border/50 flex justify-between border-b pb-2"
          >
            <span className="text-muted-foreground text-sm">{label}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: "hsl(var(--gold))" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}

      {!hasRequiredLevel ? (
        <div className="bg-muted/30 rounded-lg py-4 text-center">
          <p className="text-muted-foreground text-sm">
            Your character must be at least level{" "}
            <span className="text-gold font-semibold">{MIN_RESET_LEVEL}</span>{" "}
            to reset.
          </p>
        </div>
      ) : !isUnderResetLimit ? (
        <div className="bg-muted/30 rounded-lg py-4 text-center">
          <p className="text-muted-foreground text-sm">
            Your character reached the reset limit (
            <span className="text-gold font-semibold">{MAX_RESETS}</span>).
          </p>
        </div>
      ) : !hasEnoughZen ? (
        <div className="bg-muted/30 rounded-lg py-4 text-center">
          <p className="text-muted-foreground text-sm">
            You need{" "}
            <span className="text-gold font-semibold">
              {resetCost.toLocaleString()}
            </span>{" "}
            Zen to reset.
          </p>
        </div>
      ) : (
        <ConfirmAction
          label="Reset Character"
          description={`Resetting will set your level back to 1, restore base stats from your class defaults, grant +${POINTS_PER_RESET} points, and cost ${resetCost.toLocaleString()} Zen.`}
          buttonLabel="Confirm Reset"
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </div>
  );
}
