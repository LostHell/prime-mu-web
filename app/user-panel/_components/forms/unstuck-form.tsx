"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { unstuckAction } from "@/lib/actions/unstuck";
import { type Character } from "@/lib/types/character";
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
      <div className="py-4 text-center">
        <div className="bg-gold/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="text-gold size-8" />
        </div>
        <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
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
            className="border-border/50 flex justify-between border-b pb-2"
          >
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-gold text-sm font-semibold">{value}</span>
          </div>
        ))}
      </div>

      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button className="w-full" onClick={handleClick} disabled={isPending}>
        {isPending ? "Teleporting..." : "Teleport to Lorencia"}
      </Button>
    </div>
  );
}
