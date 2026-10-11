import { Card, CardContent } from "@/components/ui/card";
import type { RankingEntry } from "@/lib/queries/get-rankings";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/numbers";
import { Crown } from "lucide-react";

type PodiumPosition = 1 | 2 | 3;

const PodiumCard = ({
  character,
  position,
}: {
  character?: RankingEntry;
  position: PodiumPosition;
}) => {
  const name = character?.name ?? "—";
  const characterClass = character?.class ?? "—";
  const level = character ? formatNumber(character.level) : "—";
  const resets = character ? formatNumber(character.resets) : "—";

  return (
    <Card className={cn(position === 1 && "border-gold-dim")}>
      <CardContent className="flex items-center gap-4">
        <div className="flex w-12 shrink-0 flex-col items-center">
          {position === 1 ? (
            <Crown className="text-gold size-icon-sm mb-1" aria-hidden="true" />
          ) : null}
          <span
            className={cn(
              "font-serif text-3xl leading-none",
              position === 1 ? "text-gold" : "text-foreground",
            )}
          >
            {position}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-lg">{name}</p>
          <p className="text-muted-foreground text-sm">{characterClass}</p>
          <p className="mt-2 text-sm">{resets} resets</p>
          <p className="text-muted-foreground text-sm">Level {level}</p>
          {character?.guild ? (
            <p className="text-gold mt-2 text-xs tracking-wide uppercase">
              Guild: {character.guild}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
