"use client";

import { resetCharacterAction } from "@/actions/reset-character";
import ConfirmAction from "@/components/ui/confirm-action";
import Feedback from "@/components/ui/feedback";
import OrnamentLine from "@/components/ui/ornament-line";
import { MAX_RESETS, MIN_RESET_LEVEL, POINTS_PER_RESET, RESET_COST_PER_RESET } from "@/constants/resets";
import { Character } from "@/types/character";
import { startTransition, useActionState } from "react";

interface ResetFormProps {
  character: Character;
}

const ResetForm = ({ character }: ResetFormProps) => {
  const [state, formAction, isPending] = useActionState(resetCharacterAction, {});

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

  return (
    <div className="space-y-6">
      <h2 className="section-title">Reset Character</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Current Resets", value: character.resets },
          { label: "Max Resets", value: MAX_RESETS },
          { label: "Current Level", value: character.level },
          { label: "Required Level", value: MIN_RESET_LEVEL },
          { label: "Current Zen", value: character.zen.toLocaleString() },
          { label: "Reset Cost", value: resetCost.toLocaleString() },
          { label: "Points per Reset", value: `+${POINTS_PER_RESET}` },
          { label: "Level after Reset", value: 1 },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="font-semibold text-sm" style={{ color: "hsl(var(--gold))" }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <OrnamentLine />
      {state.message && <Feedback type={state.success ? "success" : "error"} message={state.message} />}
      {!hasRequiredLevel ? (
        <p className="text-sm text-center text-muted-foreground">
          Your character must be at least level {MIN_RESET_LEVEL} to reset.
        </p>
      ) : !isUnderResetLimit ? (
        <p className="text-sm text-center text-muted-foreground">
          Your character reached the reset limit ({MAX_RESETS}).
        </p>
      ) : !hasEnoughZen ? (
        <p className="text-sm text-center text-muted-foreground">You need {resetCost.toLocaleString()} Zen to reset.</p>
      ) : (
        <ConfirmAction
          label="Reset Character"
          description={`Resetting will set your level back to 1, restore base stats from your class defaults, grant +${POINTS_PER_RESET} points, and cost ${resetCost.toLocaleString()} Zen.`}
          buttonLabel="Confirm Reset"
          buttonColor="hsl(var(--crimson))"
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </div>
  );
}

export default ResetForm;