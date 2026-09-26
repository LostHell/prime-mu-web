"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CharacterSection, CharacterValues } from "../character-info";
import { Input } from "@/components/ui/input";
import { addStatsAction } from "@/lib/actions/add-stats";
import { type Character } from "@/lib/types/character";
import { ALLOCATABLE_STATS, STAT_LABELS } from "@/constants/character-rules";
import type { ActionState } from "@/lib/types/action-state";
import { useActionState, useState } from "react";

interface AddStatsFormProps {
  character: Character;
}

export function AddStatsForm({ character }: AddStatsFormProps) {
  const [pts, setPts] = useState({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (previousState, formData) => {
      const result = await addStatsAction(previousState, formData);
      if (result.success) {
        setPts({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
      }
      return result;
    },
    {},
  );

  const ptsTotal = Object.values(pts).reduce((a, b) => a + b, 0);
  const remaining = character.freePoints - ptsTotal;

  const updateStat = (stat: keyof typeof pts, value: string) => {
    const num = parseInt(value) || 0;
    const maxAllowed = remaining + pts[stat];
    const clamped = Math.max(0, Math.min(num, maxAllowed));
    setPts((prev) => ({ ...prev, [stat]: clamped }));
  };

  const handleSubmit = (formData: FormData) => {
    formData.set("characterName", character.name);
    formData.set("str", String(pts.str));
    formData.set("agi", String(pts.agi));
    formData.set("vit", String(pts.vit));
    formData.set("ene", String(pts.ene));
    formData.set("cmd", String(pts.cmd));
    formAction(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <CharacterSection title="Stat points">
        <CharacterValues
          items={[
            {
              label: "Available",
              value: character.freePoints.toLocaleString(),
            },
            {
              label: "Remaining after allocation",
              value: remaining.toLocaleString(),
            },
          ]}
        />
      </CharacterSection>
      <form action={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
          {ALLOCATABLE_STATS.map((stat) => (
            <Field
              key={stat}
              orientation="horizontal"
              className="grid grid-cols-2 items-center gap-4 has-[>[data-slot=field-content]]:items-center"
              data-disabled={isPending}
              data-invalid={Boolean(state.errors?.[stat])}
            >
              <FieldContent className="min-w-0">
                <FieldLabel htmlFor={`stat-${stat}`}>
                  {STAT_LABELS[stat]}
                </FieldLabel>
                <FieldDescription id={`stat-${stat}-description`}>
                  {character.stats[stat].toLocaleString()}
                  {pts[stat] > 0 && (
                    <>
                      {" "}
                      → {(character.stats[stat] + pts[stat]).toLocaleString()}
                    </>
                  )}
                </FieldDescription>
                {state.errors?.[stat] && (
                  <p className="text-destructive text-sm">
                    {state.errors[stat]}
                  </p>
                )}
              </FieldContent>
              <Input
                id={`stat-${stat}`}
                aria-label={`Points to add to ${STAT_LABELS[stat].toLowerCase()}`}
                aria-describedby={`stat-${stat}-description`}
                aria-invalid={Boolean(state.errors?.[stat])}
                type="number"
                inputMode="numeric"
                min={0}
                max={remaining + pts[stat]}
                step={1}
                value={pts[stat] || ""}
                onChange={(event) => updateStat(stat, event.target.value)}
                placeholder="0"
                disabled={isPending}
                className="w-full"
              />
            </Field>
          ))}
        </FieldGroup>
        <p className="text-muted-foreground text-sm">
          Your account must be offline to apply stat points.
        </p>
        {state.message && (
          <Alert variant={state.success ? "success" : "destructive"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={ptsTotal === 0 || isPending}
          className="w-full sm:w-auto sm:self-start"
        >
          {isPending
            ? "Applying..."
            : ptsTotal > 0
              ? `Apply ${ptsTotal} points`
              : "Enter points to allocate"}
        </Button>
      </form>
    </div>
  );
}
