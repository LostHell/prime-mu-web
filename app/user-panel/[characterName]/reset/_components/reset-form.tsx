"use client";

import { resetCharacterAction } from "@/actions/reset-character";
import { ConfirmAction } from "@/components/ui/confirm-action";
import { Feedback } from "@/components/ui/feedback";
import { MIN_RESET_LEVEL, POINTS_PER_RESET } from "@/constants/resets";
import { Character } from "@/lib/types/character";
import { useActionState } from "react";

interface ResetFormProps {
  character: Character;
}

export function ResetForm({ character }: ResetFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetCharacterAction,
    {},
  );

  const canReset = character.level >= MIN_RESET_LEVEL;

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="section-title">Reset Character</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Current Resets", value: character.resets },
          { label: "Current Level", value: character.level },
          { label: "Required Level", value: MIN_RESET_LEVEL },
          { label: "Points per Reset", value: `+${POINTS_PER_RESET}` },
          { label: "Level after Reset", value: 1 },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between border-b border-border pb-2"
          >
            <span className="text-muted-foreground text-sm">{label}</span>
            <span
              className="font-semibold text-sm"
              style={{ color: "hsl(var(--gold))" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <div className="ornament-line" />
      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}
      {!canReset ? (
        <p className="text-sm text-center text-muted-foreground">
          Your character must be at least level {MIN_RESET_LEVEL} to reset.
        </p>
      ) : (
        <ConfirmAction
          label="Reset Character"
          description="Resetting will set your level back to 1 and grant you bonus stat points. Your items and zen are preserved."
          buttonLabel="Confirm Reset"
          buttonColor="hsl(var(--crimson))"
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </div>
  );
}
