"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopPlayerEntry } from "@/lib/queries/get-top-players";
import { type CharacterClass } from "@/lib/types/character";
import { useState } from "react";

const PAGE_SIZE = 20;

const CLASS_FILTERS: ("All" | CharacterClass)[] = [
  "All",
  "Dark Knight",
  "Blade Knight",
  "Dark Wizard",
  "Soul Master",
  "Fairy Elf",
  "Muse Elf",
  "Magic Gladiator",
];

interface PlayersTableProps {
  players: TopPlayerEntry[];
}

const PlayersTable = ({ players }: PlayersTableProps) => {
  const [activeClass, setActiveClass] = useState<"All" | CharacterClass>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = players
    .filter((p) => activeClass === "All" || p.class === activeClass)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleClassChange(cls: "All" | CharacterClass) {
    setActiveClass(cls);
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div>
      <Input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name..."
        className="mb-4"
        suppressHydrationWarning
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {CLASS_FILTERS.map((cls) => (
          <Button
            key={cls}
            type="button"
            size="sm"
            variant={activeClass === cls ? "outline" : "ghost"}
            aria-pressed={activeClass === cls}
            onClick={() => handleClassChange(cls)}
          >
            {cls}
          </Button>
        ))}
      </div>

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
          {paginated.map((player) => (
            <TableRow key={player.name}>
              <TableCell className="text-gold">{player.rank}</TableCell>
              <TableCell className="font-medium">
                <span>{player.name}</span>
                <span className="block text-xs md:hidden">{player.class}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {player.class}
              </TableCell>
              <TableCell>{player.level}</TableCell>
              <TableCell>{player.resets}</TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {player.guild || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-muted-foreground text-sm">
          Page {currentPage} of {totalPages} &mdash; {filtered.length} players
        </span>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                data-disabled={currentPage === 1 ? "" : undefined}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage === 1) return;
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === totalPages}
                data-disabled={currentPage === totalPages ? "" : undefined}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage === totalPages) return;
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PlayersTable;
