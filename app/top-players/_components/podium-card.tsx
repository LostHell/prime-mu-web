import { TopPlayerEntry } from "@/app/top-players/_lib/get-top-players";
import { cn } from "@/lib/utils";
import { CLASS_TEXT_COLOR } from "@/types/character";
import { Medal, Trophy } from "lucide-react";

type PodiumPosition = 1 | 2 | 3;

const PODIUM_CONFIG: Record<PodiumPosition, { icon: React.ReactNode; className: string }> = {
  1: {
    icon: <Trophy className="w-8 h-8 text-gold" />,
    className: "md:scale-110 md:-mt-4 animate-glow [animation-delay:0.15s]",
  },
  2: {
    icon: <Medal className="w-7 h-7 text-gray-400" />,
    className: "[animation-delay:0s]",
  },
  3: {
    icon: <Medal className="w-6 h-6 text-amber-700" />,
    className: "[animation-delay:0.30s]",
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
    <div
      className={cn(
        "card-dark p-6 text-center card-hover animate-fade-up fill-mode-[backwards]",
        config.className,
        className,
      )}
    >
      <div className="flex items-center justify-center mb-4">{config.icon}</div>

      <div className="font-serif text-lg text-gold mb-2">#{position}</div>
      <h3 className="font-serif text-xl font-bold text-foreground mb-1">{player.name}</h3>
      <p className={cn("text-sm", CLASS_TEXT_COLOR[player.class])}>{player.class}</p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest">Level</div>
          <div className="text-lg font-bold gold-gradient-text">{player.level}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest">Resets</div>
          <div className="text-lg font-bold gold-gradient-text">{player.resets}</div>
        </div>
      </div>

      {player.guild && (
        <p className="mt-3 text-xs text-muted-foreground">
          Guild: <span className="text-gold">{player.guild}</span>
        </p>
      )}
    </div>
  );
};

export default PodiumCard;
