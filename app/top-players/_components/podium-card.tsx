import { Card, CardContent } from "@/components/ui/card";
import { TopCharacterEntry } from "@/lib/queries/get-top-characters";
import { cn } from "@/lib/utils";
import { Medal, Trophy } from "lucide-react";

type PodiumPosition = 1 | 2 | 3;

const PODIUM_CONFIG: Record<
  PodiumPosition,
  { icon: React.ReactNode; className: string }
> = {
  1: {
    icon: <Trophy className="text-gold h-8 w-8" />,
    className: "animate-glow md:-translate-y-3 [animation-delay:0.15s]",
  },
  2: {
    icon: <Medal className="h-7 w-7 text-gray-400" />,
    className: "md:translate-y-3 [animation-delay:0s]",
  },
  3: {
    icon: <Medal className="h-6 w-6 text-amber-700 md:mt-4" />,
    className: "md:translate-y-3 [animation-delay:0.30s]",
  },
};

interface PodiumCardProps {
  character?: TopCharacterEntry;
  position: PodiumPosition;
  className?: string;
}

const PodiumCard = ({ character, position, className }: PodiumCardProps) => {
  const config = PODIUM_CONFIG[position];

  const characterName = character?.name ?? "—";
  const characterClass = character?.class ?? "—";
  const characterLevel = character?.level ?? "—";
  const characterResets = character?.resets ?? "—";

  return (
    <Card className={cn("card-hover text-center", config.className, className)}>
      <CardContent>
        <div className="mb-4 flex items-center justify-center">
          {config.icon}
        </div>

        <div className="text-gold mb-2 font-serif text-lg">#{position}</div>
        <h3 className="text-foreground mb-1 font-serif text-xl font-bold">
          {characterName}
        </h3>
        <p className="text-sm">
          {characterClass}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-muted-foreground text-xs tracking-widest uppercase">
              Level
            </div>
            <div className="gold-gradient-text text-lg font-bold">
              {characterLevel}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs tracking-widest uppercase">
              Resets
            </div>
            <div className="gold-gradient-text text-lg font-bold">
              {characterResets}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
