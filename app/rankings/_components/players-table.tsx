import ClassFilter from "@/app/rankings/_components/class-filter";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAX_SEARCH_LENGTH } from "@/constants/pagination";
import type { RankingEntry } from "@/lib/queries/get-rankings";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/numbers";
import Form from "next/form";
import type { RankingView } from "./rankings-tabs";

export default function PlayersTable({
  characters,
  query,
  classId,
  view,
  onlineNames,
}: {
  characters: RankingEntry[];
  query: string;
  classId?: number;
  view: RankingView;
  onlineNames: ReadonlySet<string>;
}) {
  return (
    <div>
      <Form
        action="/rankings"
        scroll={false}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        {view !== "players" ? (
          <input type="hidden" name="view" value={view} />
        ) : null}
        <Field className="flex-1">
          <FieldLabel htmlFor="player-search">Search players</FieldLabel>
          <Input
            id="player-search"
            name="query"
            defaultValue={query}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Search character..."
          />
        </Field>
        <Field className="sm:w-52">
          <FieldLabel htmlFor="player-class">Class</FieldLabel>
          <ClassFilter classId={classId} />
        </Field>
        <Button type="submit">Search</Button>
      </Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Character</TableHead>
            <TableHead className="hidden md:table-cell">Class</TableHead>
            <TableHead className="hidden lg:table-cell">Guild</TableHead>
            <TableHead>Resets</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!characters.length && (
            <TableRow>
              <TableCell colSpan={7}>
                No characters match these filters.
              </TableCell>
            </TableRow>
          )}
          {characters.map((character) => {
            const online = onlineNames.has(character.name);
            return (
              <TableRow key={character.name}>
                <TableCell className="text-gold">{character.rank}</TableCell>
                <TableCell className="font-medium">
                  <span>{character.name}</span>
                  <span className="text-muted-foreground block text-xs md:hidden">
                    {character.class}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {character.class}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">
                  {character.guild || "—"}
                </TableCell>
                <TableCell className="text-gold">
                  {formatNumber(character.resets)}
                </TableCell>
                <TableCell>{formatNumber(character.level)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        online ? "bg-online" : "bg-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    {online ? "Online" : "Offline"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
