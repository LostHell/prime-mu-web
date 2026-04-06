import { auth } from "@/auth";
import { CLASS_COLOR, CMD_CLASSES } from "@/lib/types/character";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "../_lib/get-character";

interface CharacterOverviewPageProps {
  params: Promise<{ characterName: string }>;
}

export default async function CharacterOverviewPage({ params }: CharacterOverviewPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { characterName } = await params;
  const decodedName = decodeURIComponent(characterName);
  const character = await getCharacter(session.user.id, decodedName);

  if (!character) {
    notFound();
  }

  const hasCmd = CMD_CLASSES.includes(character.class);

  return (
    <div className="space-y-6">
      <h2 className="section-title">Character Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Name", value: character.name },
          {
            label: "Class",
            value: character.class,
            color: CLASS_COLOR[character.class],
          },
          { label: "Level", value: character.level },
          { label: "Resets", value: character.resets },
          { label: "Guild", value: character.guild ?? "—" },
          { label: "Zen", value: character.zen.toLocaleString() },
          { label: "Free Points", value: character.freePoints },
          {
            label: "PK Count",
            value: character.pkCount,
            color: character.pkCount > 0 ? "hsl(var(--crimson))" : undefined,
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="font-semibold text-sm" style={{ color: color ?? "hsl(var(--gold))" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="ornament-line" />
      <h3 className="font-serif text-sm uppercase tracking-widest text-gold">Base Stats</h3>
      <div className={`grid ${hasCmd ? "grid-cols-5" : "grid-cols-4"} gap-2 text-center`}>
        {(Object.entries(character.stats) as [string, number][])
          .filter(([key]) => key !== "cmd" || hasCmd)
          .map(([key, val]) => (
            <div key={key} className="stat-card py-3 px-1">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{key}</div>
              <div className="font-bold font-mono text-gold">{val}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
