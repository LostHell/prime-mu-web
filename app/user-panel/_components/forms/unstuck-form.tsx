"use client";

import { unstuckAction } from "@/actions/unstuck";
import { Button } from "@/components/ui/button";
import Feedback from "@/components/ui/feedback";
import { Character } from "@/types/character";
import { MapPin } from "lucide-react";
import { useActionState } from "react";

interface UnstuckFormProps {
  character: Character;
}

export function UnstuckForm({ character }: UnstuckFormProps) {
  const [state, formAction, isPending] = useActionState(unstuckAction, {});

  const handleClick = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <MapPin className="size-8 text-gold" />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
          If your character is trapped or stuck in a location, use this to
          teleport safely to{" "}
          <span className="text-gold font-semibold">Lorencia</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Destination", value: "Lorencia" },
          { label: "Cooldown", value: "10 minutes" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between border-b border-border/50 pb-2"
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

      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}

      <Button
        className="w-full"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Teleporting..." : "Teleport to Lorencia"}
      </Button>
    </div>
  );
}
