import ClassAvatar from "@/components/class-avatar";
import { Character, CLASS_COLOR } from "@/lib/types/character";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const classColor = CLASS_COLOR[character.class];

  return (
    <Link
      href={`/user-panel/${encodeURIComponent(character.name)}`}
      className="card-dark card-hover p-5 flex flex-col items-center text-center transition-all group relative overflow-hidden"
      style={{ borderColor: classColor + "55" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${classColor}18 0%, transparent 70%)`,
        }}
      />

      <ClassAvatar
        muClass={character.class}
        color={classColor}
        className="w-20 h-24 mb-3"
      />

      <span
        className="text-xs font-serif uppercase tracking-widest mb-1"
        style={{ color: classColor }}
      >
        {character.class}
      </span>

      <div className="font-serif font-bold text-base gold-gradient-text mb-3">
        {character.name}
      </div>

      <div className="ornament-line w-full mb-3" />

      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1">
        {[
          { label: "Level", value: character.level },
          { label: "Resets", value: character.resets },
          { label: "Guild", value: character.guild ?? "—" },
          {
            label: "PK",
            value: character.pkCount,
            color:
              character.pkCount > 0 ? "hsl(var(--crimson))" : undefined,
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span
              className="text-xs font-semibold"
              style={{ color: color ?? "hsl(var(--gold))" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <ChevronRight
        className="absolute top-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: classColor }}
      />
    </Link>
  );
}
