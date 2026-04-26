"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addStatsAction } from "@/lib/actions/add-stats";
import { type Character, CMD_CLASSES } from "@/lib/types/character";
import { cn } from "@/lib/utils";
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
      <Card className="gap-0 p-5 text-center">
        <p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
          Available Points
        </p>
        <p
          className={cn(
            "text-4xl font-bold tabular-nums",
            remaining > 0 ? "text-gold" : "text-muted-foreground",
          )}
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
      </Card>

      <form action={handleSubmit} className="space-y-3">
        {(["str", "agi", "vit", "ene", "cmd"] as const)
          .filter((s) => s !== "cmd" || hasCmd)
          .map((stat) => {
            const hasChange = pts[stat] > 0;
            return (
              <Card
                key={stat}
                className={cn(
                  "flex flex-row items-center gap-4 p-4 shadow-none backdrop-blur-none transition-colors",
                  hasChange
                    ? "border-gold/30 bg-gold/5"
                    : "border-border/50 bg-muted/30",
                )}
              >
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
                      <span className="text-gold text-sm font-semibold tabular-nums">
                        → {(character.stats[stat] + pts[stat]).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={remaining + pts[stat]}
                  value={pts[stat] || ""}
                  onChange={(e) => updateStat(stat, e.target.value)}
                  placeholder="0"
                  disabled={isPending}
                  className={cn(
                    "h-12 w-20 text-center text-lg font-bold tabular-nums",
                    hasChange ? "text-gold" : "text-muted-foreground",
                  )}
                />
              </Card>
            );
          })}

        {state.message && (
          <div className="pt-2">
            <Alert variant={state.success ? "success" : "destructive"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <Button
          type="submit"
          disabled={ptsTotal === 0 || isPending}
          className="mt-4 w-full"
          size="lg"
        >
          {isPending
            ? "Applying..."
            : ptsTotal > 0
              ? `Apply ${ptsTotal} Points`
              : "Enter points to allocate"}
        </Button>
      </form>
    </div>
  );
}
