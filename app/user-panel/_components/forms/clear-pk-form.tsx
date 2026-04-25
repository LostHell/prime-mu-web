"use client";

import ConfirmAction from "@/components/ui/confirm-action";
import Feedback from "@/components/ui/feedback";
import { clearPkAction } from "@/lib/actions/clear-pk";
import { Character } from "@/types/character";
import { ShieldCheck, Skull } from "lucide-react";
import { useActionState } from "react";

interface ClearPkFormProps {
  character: Character;
}

export function ClearPkForm({ character }: ClearPkFormProps) {
  const [state, formAction, isPending] = useActionState(clearPkAction, {});

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  const hasPk = character.pkCount > 0;

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{
            background: hasPk ? "hsl(var(--crimson) / 0.1)" : "hsl(var(--online) / 0.1)",
          }}
        >
          {hasPk ? (
            <Skull className="size-8 text-crimson" />
          ) : (
            <ShieldCheck className="size-8 text-online" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">Current PK Count:</span>
          <span
            className="font-bold text-2xl tabular-nums"
            style={{
              color: hasPk ? "hsl(var(--crimson))" : "hsl(var(--online))",
            }}
          >
            {character.pkCount}
          </span>
        </div>
      </div>

      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}

      {!hasPk ? (
        <div className="text-center py-4 rounded-lg bg-online/5 border border-online/20">
          <ShieldCheck className="size-5 mx-auto mb-2 text-online" />
          <p className="text-sm text-muted-foreground">
            Your character has no PK kills. Nothing to clear.
          </p>
        </div>
      ) : (
        <ConfirmAction
          label="Clear PK Status"
          description="This will remove all Player Killer marks from your character, allowing you to enter towns and interact with NPCs freely."
          buttonLabel="Confirm Clear"
          onConfirm={handleConfirm}
          disabled={isPending}
        />
      )}
    </div>
  );
}
