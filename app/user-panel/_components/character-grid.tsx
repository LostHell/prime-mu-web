import { Character } from "@/lib/types/character";
import CharacterCard from "./character-card";

interface CharacterGridProps {
  characters: Character[];
}

const CharacterGrid = ({ characters }: CharacterGridProps) => {
  if (characters.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        No characters found on this account yet.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {characters.map((character) => (
        <CharacterCard key={character.name} character={character} />
      ))}
    </div>
  );
};

export default CharacterGrid;
