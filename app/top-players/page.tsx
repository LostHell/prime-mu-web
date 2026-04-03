import { PlayersTable } from "@/app/top-players/_components/players-table";
import { getTopPlayers } from "@/app/top-players/_lib/get-top-players";
import Divider from "@/components/divider";
import { BRAND } from "@/constants/app";
import { CLASS_COLOR } from "@/lib/types/character";
import { Medal, Trophy } from "lucide-react";

const TopPlayers = async () => {
  const allPlayers = await getTopPlayers();
  const top3 = allPlayers.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-48 pb-16">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-4">Top Players</h1>
        <p className="text-muted-foreground text-lg">The mightiest warriors of {BRAND}</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[top3[1], top3[0], top3[2]].map((player, i) => {
          const podiumOrder = [2, 1, 3];
          const isFirst = podiumOrder[i] === 1;
          return (
            <div
              key={player.name}
              className={`card-dark p-6 text-center card-hover animate-fade-up ${isFirst ? "md:scale-110 md:-mt-4 animate-glow" : ""}`}
              style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "backwards" }}
            >
              <div className="flex items-center justify-center mb-4">
                {podiumOrder[i] === 1 && <Trophy className="w-8 h-8" style={{ color: "hsl(var(--gold))" }} />}
                {podiumOrder[i] === 2 && <Medal className="w-7 h-7 text-gray-400" />}
                {podiumOrder[i] === 3 && <Medal className="w-6 h-6 text-amber-700" />}
              </div>
              <div className="font-serif text-lg mb-2" style={{ color: "hsl(var(--gold))" }}>
                #{podiumOrder[i]}
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">{player.name}</h3>
              <p className="text-sm" style={{ color: CLASS_COLOR[player.class] }}>
                {player.class}
              </p>
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
                  Guild: <span style={{ color: "hsl(var(--gold))" }}>{player.guild}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Divider />

      {/* Full Table */}
      <div
        className="card-dark p-6 card-hover animate-fade-up"
        style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
      >
        <PlayersTable players={allPlayers} />
      </div>
    </div>
  );
};

export default TopPlayers;
