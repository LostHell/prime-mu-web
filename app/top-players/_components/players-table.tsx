"use client";

import { TopPlayerEntry } from "@/app/top-players/_lib/get-top-players";
import { CLASS_TEXT_COLOR, MuClass } from "@/lib/types/character";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PAGE_SIZE = 20;

const CLASS_FILTERS: ("All" | MuClass)[] = ["All", "Dark Knight", "Dark Wizard", "Fairy Elf", "Magic Gladiator"];

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
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
        className="input-gold w-full mb-4"
        suppressHydrationWarning
      />
      <div className="flex flex-wrap gap-2 mb-6">
        {CLASS_FILTERS.map((cls) => (
          <button
            key={cls}
            onClick={() => handleClassChange(cls)}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              activeClass === cls
                ? "border-gold text-gold bg-[hsl(var(--gold)/0.1)]"
                : "border-border text-muted-foreground hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
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
              <tr key={player.name} className="border-b border-border/50 table-row-hover">
                <td className="table-body-cell text-gold">{player.rank}</td>
                <td className="table-body-cell font-medium">
                  <span>{player.name}</span>
                  <span className={cn("block text-xs md:hidden", CLASS_TEXT_COLOR[player.class])}>{player.class}</span>
                </td>
                <td className={cn("table-body-cell hidden md:table-cell", CLASS_TEXT_COLOR[player.class])}>
                  {player.class}
                </td>
                <td className="table-body-cell">{player.level}</td>
                <td className="table-body-cell">{player.resets}</td>
                <td className="table-body-cell text-muted-foreground hidden md:table-cell">{player.guild || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} &mdash; {filtered.length} players
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none px-3 py-1.5 text-sm rounded border border-border text-muted-foreground disabled:opacity-40 hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none px-3 py-1.5 text-sm rounded border border-border text-muted-foreground disabled:opacity-40 hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground transition-colors"
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
