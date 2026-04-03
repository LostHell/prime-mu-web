"use client";

import { CLASS_COLOR, MuClass } from "@/lib/types/character";
import { useState } from "react";
import { TopPlayerEntry } from "../_lib/get-top-players";

const PAGE_SIZE = 20;

const CLASS_FILTERS: ("All" | MuClass)[] = [
  "All",
  "Dark Knight",
  "Dark Wizard",
  "Fairy Elf",
  "Magic Gladiator",
  // "Dark Lord",
];

interface PlayersTableProps {
  players: TopPlayerEntry[];
}

export function PlayersTable({ players }: PlayersTableProps) {
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

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="table-header-cell">Rank</th>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell">Class</th>
            <th className="table-header-cell text-center">Level</th>
            <th className="table-header-cell text-center">Resets</th>
            <th className="table-header-cell text-right">Guild</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((player, i) => (
            <tr key={i} className="border-b border-border/50 table-row-hover">
              <td className="table-body-cell" style={{ color: "hsl(var(--gold))" }}>
                {player.rank}
              </td>
              <td className="table-body-cell font-medium">{player.name}</td>
              <td className="table-body-cell" style={{ color: CLASS_COLOR[player.class] }}>
                {player.class}
              </td>
              <td className="table-body-cell text-center">{player.level}</td>
              <td className="table-body-cell text-center">{player.resets}</td>
              <td className="table-body-cell text-right text-muted-foreground">{player.guild || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} &mdash; {filtered.length} players
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded border border-border text-muted-foreground disabled:opacity-40 hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded border border-border text-muted-foreground disabled:opacity-40 hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
