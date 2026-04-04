"use client";

import { addStatsAction } from "@/actions/add-stats";
import { Feedback } from "@/components/ui/feedback";
import { Character, CMD_CLASSES } from "@/lib/types/character";
import { useActionState, useState } from "react";

interface AddStatsFormProps {
  character: Character;
}

const STAT_LABELS: Record<string, string> = {
  str: "Strength",
  agi: "Agility",
  vit: "Vitality",
  ene: "Energy",
  cmd: "Command",
};

export function AddStatsForm({ character }: AddStatsFormProps) {
  const [pts, setPts] = useState({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
  const [state, formAction, isPending] = useActionState(addStatsAction, {});

  const hasCmd = CMD_CLASSES.includes(character.class);
  const ptsTotal = Object.values(pts).reduce((a, b) => a + b, 0);
  const remaining = character.freePoints - ptsTotal;

  const handleSubmit = (formData: FormData) => {
    formData.set("characterName", character.name);
    formData.set("str", String(pts.str));
    formData.set("agi", String(pts.agi));
    formData.set("vit", String(pts.vit));
    formData.set("ene", String(pts.ene));
    formData.set("cmd", String(pts.cmd));
    formAction(formData);
    if (!state.errors) {
      setPts({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Add Stats</h2>
        <span
          className="text-xs font-mono text-gold"
        >
          {remaining} pts remaining
        </span>
      </div>
      <form action={handleSubmit} className="space-y-4">
        {(["str", "agi", "vit", "ene", "cmd"] as const)
          .filter((s) => s !== "cmd" || hasCmd)
          .map((stat) => (
            <div
              key={stat}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3"
            >
              <div>
                <div
                  className="text-xs font-serif uppercase tracking-widest mb-1 text-gold"
                >
                  {STAT_LABELS[stat]}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {character.stats[stat]} →{" "}
                  <span style={{ color: "hsl(var(--gold-glow))" }}>
                    {character.stats[stat] + pts[stat]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-outline"
                style={{
                  padding: "0.25rem 0.75rem",
                  fontSize: "1rem",
                  lineHeight: 1,
                }}
                onClick={() =>
                  pts[stat] > 0 &&
                  setPts((p) => ({ ...p, [stat]: p[stat] - 1 }))
                }
                disabled={isPending}
              >
                −
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={character.freePoints}
                  value={pts[stat]}
                  onChange={(e) => {
                    const v = Math.max(
                      0,
                      Math.min(
                        Number(e.target.value),
                        character.freePoints - ptsTotal + pts[stat],
                      ),
                    );
                    setPts((p) => ({ ...p, [stat]: v }));
                  }}
                  className="input-gold text-center font-mono"
                  style={{ width: "4.5rem" }}
                  disabled={isPending}
                />
                <button
                  type="button"
                  className="btn-outline"
                  style={{
                    padding: "0.25rem 0.75rem",
                    fontSize: "1rem",
                    lineHeight: 1,
                  }}
                  onClick={() =>
                    ptsTotal < character.freePoints &&
                    setPts((p) => ({ ...p, [stat]: p[stat] + 1 }))
                  }
                  disabled={isPending}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        <div className="ornament-line" />
        {state.message && (
          <Feedback
            type={state.success ? "success" : "error"}
            message={state.message}
          />
        )}
        <button
          type="submit"
          className="btn-gold w-full"
          disabled={ptsTotal === 0 || isPending}
        >
          {isPending
            ? "Applying..."
            : `Apply ${ptsTotal > 0 ? `(${ptsTotal} pts)` : ""}`}
        </button>
      </form>
    </div>
  );
}
