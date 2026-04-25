"use client";

import { TopPlayerEntry } from "@/lib/queries/get-top-players";
import { CLASS_TEXT_COLOR, type MuClass } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PAGE_SIZE = 20;

const CLASS_FILTERS: ("All" | MuClass)[] = [
  "All",
  "Dark Knight",
  "Dark Wizard",
  "Fairy Elf",
  "Magic Gladiator",
];

interface PlayersTableProps {
  players: TopPlayerEntry[];
}

const PlayersTable = ({ players }: PlayersTableProps) => {
  const [activeClass, setActiveClass] = useState<"All" | MuClass>("All");
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

  function handleClassChange(cls: "All" | MuClass) {
    setActiveClass(cls);
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name..."
        className="input-gold mb-4 w-full"
        suppressHydrationWarning
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {CLASS_FILTERS.map((cls) => (
          <button
            key={cls}
            onClick={() => handleClassChange(cls)}
            className={`rounded border px-3 py-1.5 text-sm transition-colors ${
              activeClass === cls
                ? "border-gold text-gold bg-[hsl(var(--gold)/0.1)]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-[hsl(var(--gold)/0.5)]"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              <th className="table-header-cell">Rank</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell hidden md:table-cell">Class</th>
              <th className="table-header-cell">Level</th>
              <th className="table-header-cell">Resets</th>
              <th className="table-header-cell hidden md:table-cell">Guild</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((player) => (
              <tr
                key={player.name}
                className="border-border/50 table-row-hover border-b"
              >
                <td className="table-body-cell text-gold">{player.rank}</td>
                <td className="table-body-cell font-medium">
                  <span>{player.name}</span>
                  <span
                    className={cn(
                      "block text-xs md:hidden",
                      CLASS_TEXT_COLOR[player.class],
                    )}
                  >
                    {player.class}
                  </span>
                </td>
                <td
                  className={cn(
                    "table-body-cell hidden md:table-cell",
                    CLASS_TEXT_COLOR[player.class],
                  )}
                >
                  {player.class}
                </td>
                <td className="table-body-cell">{player.level}</td>
                <td className="table-body-cell">{player.resets}</td>
                <td className="table-body-cell text-muted-foreground hidden md:table-cell">
                  {player.guild || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages} &mdash; {filtered.length} players
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border text-muted-foreground hover:text-foreground flex-1 rounded border px-3 py-1.5 text-sm transition-colors hover:border-[hsl(var(--gold)/0.5)] disabled:opacity-40 sm:flex-none"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border text-muted-foreground hover:text-foreground flex-1 rounded border px-3 py-1.5 text-sm transition-colors hover:border-[hsl(var(--gold)/0.5)] disabled:opacity-40 sm:flex-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersTable;
