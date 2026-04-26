import { Card, CardContent } from "@/components/ui/card";
import { TopPlayerEntry } from "@/lib/queries/get-top-players";
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
  player: TopPlayerEntry;
  position: PodiumPosition;
  className?: string;
}

const PodiumCard = ({ player, position, className }: PodiumCardProps) => {
  const config = PODIUM_CONFIG[position];

  return (
    <Card className={cn("card-hover text-center", config.className, className)}>
      <CardContent>
        <div className="mb-4 flex items-center justify-center">
          {config.icon}
        </div>

        <div className="text-gold mb-2 font-serif text-lg">#{position}</div>
        <h3 className="text-foreground mb-1 font-serif text-xl font-bold">
          {player.name}
        </h3>
        <p className="text-sm">
          {player.class}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-muted-foreground text-xs tracking-widest uppercase">
              Level
            </div>
            <div className="gold-gradient-text text-lg font-bold">
              {player.level}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs tracking-widest uppercase">
              Resets
            </div>
            <div className="gold-gradient-text text-lg font-bold">
              {player.resets}
            </div>
          </div>
        </div>

        {player.guild && (
          <p className="text-muted-foreground mt-3 text-xs">
            Guild: <span className="text-gold">{player.guild}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
