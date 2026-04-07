"use client";

import { clearPkAction } from "@/actions/clear-pk";
import ConfirmAction from "@/components/ui/confirm-action";
import Feedback from "@/components/ui/feedback";
import OrnamentLine from "@/components/ui/ornament-line";
import { Character } from "@/types/character";
import { useActionState } from "react";

interface ClearPkFormProps {
  character: Character;
}

const ClearPkForm = ({ character }: ClearPkFormProps) => {
  const [state, formAction, isPending] = useActionState(clearPkAction, {});

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="section-title">Clear PK</h2>
      <div className="flex justify-between border-b border-border pb-2">
        <span className="text-muted-foreground text-sm">Current PK Count</span>
        <span
          className="font-bold font-mono text-sm"
          style={{
            color:
              character.pkCount > 0
                ? "hsl(var(--crimson))"
                : "hsl(130 60% 50%)",
          }}
        >
          {character.pkCount}
        </span>
      </div>
      <OrnamentLine />
      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}
      {character.pkCount === 0 ? (
        <p className="text-sm text-center text-muted-foreground">
          Your character has no PK kills. Nothing to clear.
        </p>
      ) : (
        <ConfirmAction
          label="Clear PK Status"
          description="This will remove all Player Killer marks from your character, allowing you to enter towns and interact with NPCs freely."
          buttonLabel="Confirm Clear"
          buttonColor="hsl(var(--crimson))"
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </div>
  );
}

export default ClearPkForm;