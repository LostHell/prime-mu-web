"use client";

import { unstuckAction } from "@/actions/unstuck";
import Feedback from "@/components/ui/feedback";
import OrnamentLine from "@/components/ui/ornament-line";
import { Character } from "@/lib/types/character";
import { useActionState } from "react";

interface UnstuckFormProps {
  character: Character;
}

const UnstuckForm = ({ character }: UnstuckFormProps) => {
  const [state, formAction, isPending] = useActionState(unstuckAction, {});

  const handleClick = () => {
    const formData = new FormData();
    formData.set("characterName", character.name);
    formAction(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="section-title">Unstuck</h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        If your character is trapped or stuck in a location, use this to
        teleport safely to{" "}
        <span style={{ color: "hsl(var(--gold))" }}>Lorencia</span>. Can only be
        used once every 10 minutes.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Destination", value: "Lorencia" },
          { label: "Cooldown", value: "10 minutes" },
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
      <OrnamentLine />
      {state.message && (
        <Feedback
          type={state.success ? "success" : "error"}
          message={state.message}
        />
      )}
      <button
        className="btn-gold w-full"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Teleporting..." : "Teleport to Lorencia"}
      </button>
    </div>
  );
};

export default UnstuckForm;