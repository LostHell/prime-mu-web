"use client";

import ConfirmAction from "@/components/ui/confirm-action";
import Feedback from "@/components/ui/feedback";
import { clearPkAction } from "@/lib/actions/clear-pk";
import { type Character } from "@/lib/types/character";
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
      <div className="py-4 text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: hasPk
              ? "hsl(var(--crimson) / 0.1)"
              : "hsl(var(--online) / 0.1)",
          }}
        >
          {hasPk ? (
            <Skull className="text-crimson size-8" />
          ) : (
            <ShieldCheck className="text-online size-8" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">
            Current PK Count:
          </span>
          <span
            className="text-2xl font-bold tabular-nums"
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
        <div className="bg-online/5 border-online/20 rounded-lg border py-4 text-center">
          <ShieldCheck className="text-online mx-auto mb-2 size-5" />
          <p className="text-muted-foreground text-sm">
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
