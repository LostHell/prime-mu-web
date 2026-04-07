import { Character, CLASS_COLOR } from "@/types/character";
import { User } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  character: Character;
}

const DashboardHeader = ({ character }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 animate-fade-up">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">
          User Panel
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back,{" "}
          <span
            className="font-semibold"
            style={{ color: CLASS_COLOR[character.class] }}
          >
            {character.name}
          </span>
          <span className="text-muted-foreground"> — </span>
          <span
            className="text-xs"
            style={{ color: CLASS_COLOR[character.class] }}
          >
            {character.class}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/user-panel"
          className="btn-outline flex items-center gap-2"
          style={{ padding: "0.5rem 1rem" }}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Characters</span>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
