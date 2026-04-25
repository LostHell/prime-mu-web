"use client";

import Feedback from "@/components/ui/feedback";
import { addStatsAction } from "@/lib/actions/add-stats";
import { type Character, CLASS_COLOR, CMD_CLASSES } from "@/lib/types/character";
import { useActionState, useState } from "react";

interface AddStatsFormProps {
  character: Character;
}

type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const STAT_CONFIG: Record<string, { label: string; short: string }> = {
  str: { label: "Strength", short: "STR" },
  agi: { label: "Agility", short: "AGI" },
  vit: { label: "Vitality", short: "VIT" },
  ene: { label: "Energy", short: "ENE" },
  cmd: { label: "Command", short: "CMD" },
};

export function AddStatsForm({ character }: AddStatsFormProps) {
  const [pts, setPts] = useState({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addStatsAction,
    {},
  );

  const hasCmd = CMD_CLASSES.includes(character.class);
  const ptsTotal = Object.values(pts).reduce((a, b) => a + b, 0);
  const remaining = character.freePoints - ptsTotal;
  const classColor = CLASS_COLOR[character.class];

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
    if (!state.errors) {
      setPts({ str: 0, agi: 0, vit: 0, ene: 0, cmd: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with available points */}
      <div
        className="rounded-xl p-5 text-center"
        style={{
          background: `linear-gradient(135deg, ${classColor}15 0%, transparent 60%), hsl(var(--muted) / 0.3)`,
          border: `1px solid ${classColor}20`,
        }}
      >
        <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
          Available Points
        </p>
        <p
          className="text-4xl font-bold tabular-nums"
          style={{
            color: remaining > 0 ? classColor : "hsl(var(--muted-foreground))",
          }}
        >
          {remaining.toLocaleString()}
        </p>
        {ptsTotal > 0 && (
          <p className="text-muted-foreground mt-2 text-xs">
            Allocating{" "}
            <span className="text-foreground font-medium">{ptsTotal}</span>{" "}
            points
          </p>
        )}
      </div>

      <form action={handleSubmit} className="space-y-3">
        {(["str", "agi", "vit", "ene", "cmd"] as const)
          .filter((s) => s !== "cmd" || hasCmd)
          .map((stat) => {
            const hasChange = pts[stat] > 0;
            return (
              <div
                key={stat}
                className="flex items-center gap-4 rounded-xl p-4 transition-colors"
                style={{
                  background: hasChange
                    ? `${classColor}08`
                    : "hsl(var(--muted) / 0.3)",
                  border: `1px solid ${hasChange ? `${classColor}30` : "hsl(var(--border) / 0.5)"}`,
                }}
              >
                {/* Stat info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      {STAT_CONFIG[stat].short}
                    </span>
                    <span className="text-muted-foreground/60 hidden text-xs sm:inline">
                      {STAT_CONFIG[stat].label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-foreground text-2xl font-bold tabular-nums">
                      {character.stats[stat].toLocaleString()}
                    </span>
                    {hasChange && (
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: classColor }}
                      >
                        → {(character.stats[stat] + pts[stat]).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Input */}
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={remaining + pts[stat]}
                  value={pts[stat] || ""}
                  onChange={(e) => updateStat(stat, e.target.value)}
                  placeholder="0"
                  disabled={isPending}
                  className="bg-background/50 h-12 w-20 rounded-xl border-0 text-center text-lg font-bold tabular-nums focus:ring-2 focus:outline-none disabled:opacity-50"
                  style={{
                    color: hasChange
                      ? classColor
                      : "hsl(var(--muted-foreground))",
                    boxShadow: hasChange
                      ? `0 0 0 2px ${classColor}40`
                      : "0 0 0 1px hsl(var(--border) / 0.5)",
                  }}
                />
              </div>
            );
          })}

        {/* Feedback */}
        {state.message && (
          <div className="pt-2">
            <Feedback
              type={state.success ? "success" : "error"}
              message={state.message}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={ptsTotal === 0 || isPending}
          className="mt-4 w-full rounded-xl py-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: ptsTotal > 0 ? classColor : "hsl(var(--muted))",
            color:
              ptsTotal > 0
                ? "hsl(var(--background))"
                : "hsl(var(--muted-foreground))",
          }}
        >
          {isPending
            ? "Applying..."
            : ptsTotal > 0
              ? `Apply ${ptsTotal} Points`
              : "Enter points to allocate"}
        </button>
      </form>
    </div>
  );
}
