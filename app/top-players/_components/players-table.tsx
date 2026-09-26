import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import type { TopCharacterEntry } from "@/lib/queries/get-top-characters";

export default function PlayersTable({
  characters,
  query,
  classId,
}: {
  characters: TopCharacterEntry[];
  query: string;
  classId?: number;
}) {
  return (
    <div>
      <form
        action="/top-players"
        method="get"
        className="mb-4 flex items-end gap-3"
      >
        <Field>
          <FieldLabel htmlFor="player-search">Search players</FieldLabel>
          <Input
            id="player-search"
            name="q"
            defaultValue={query}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Character name"
          />
        </Field>
        {classId !== undefined && (
          <input type="hidden" name="class" value={classId} />
        )}
        <Button type="submit">Search</Button>
      </form>
      <nav
        aria-label="Filter players by class"
        className="mb-6 flex flex-wrap gap-2"
      >
        {[["", "All"], ...Object.entries(CHARACTER_CLASS_BY_ID)].map(
          ([id, label]) => {
            const active =
              (classId === undefined ? "" : String(classId)) === id;
            const params = new URLSearchParams({
              ...(query ? { q: query } : {}),
              ...(id ? { class: id } : {}),
            });
            return (
              <Button
                key={id}
                size="sm"
                variant={active ? "outline" : "ghost"}
                asChild
              >
                <Link
                  href={`/top-players?${params}`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </Button>
            );
          },
        )}
      </nav>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Class</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Resets</TableHead>
            <TableHead className="hidden md:table-cell">Guild</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!characters.length && (
            <TableRow>
              <TableCell colSpan={6}>
                No characters match these filters.
              </TableCell>
            </TableRow>
          )}
          {characters.map((character) => (
            <TableRow key={character.name}>
              <TableCell className="text-gold">{character.rank}</TableCell>
              <TableCell className="font-medium">
                <span>{character.name}</span>
                <span className="block text-xs md:hidden">
                  {character.class}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {character.class}
              </TableCell>
              <TableCell>{character.level}</TableCell>
              <TableCell>{character.resets}</TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {character.guild || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
