import { render, screen, within } from "@testing-library/react";
import type { RankingEntry } from "@/lib/queries/get-rankings";
import PlayersTable from "./players-table";

jest.mock("@/lib/game/constants/maps", () => ({
  MAP_NAME_BY_ID: { 0: "Lorencia", 3: "Noria", 11: "Blood Castle 1" },
}));
jest.mock("@/app/rankings/_components/class-filter", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("next/form", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <form>{children}</form>
  ),
}));

const characters: RankingEntry[] = [
  {
    rank: 1,
    name: "Gladius",
    class: "Magic Gladiator",
    level: 300,
    resets: 5,
    guild: "Legends",
    map: 11,
  },
  {
    rank: 2,
    name: "Arrow",
    class: "Muse Elf",
    level: 200,
    resets: 2,
    map: 3,
  },
];

const rowOf = (name: string) =>
  screen.getAllByText(name)[0].closest("tr") as HTMLElement;

test("the online list puts the map between Class and Guild, with short class names and BC/DS", () => {
  render(
    <PlayersTable
      characters={characters}
      query=""
      view="online"
      onlineNames={new Set(["Gladius", "Arrow"])}
    />,
  );

  const headers = screen
    .getAllByRole("columnheader")
    .map((header) => header.textContent);
  expect(headers).toEqual([
    "#",
    "Character",
    "Class",
    "Map",
    "Guild",
    "Resets",
    "Level",
    "Status",
  ]);

  const gladius = within(rowOf("Gladius"))
    .getAllByRole("cell")
    .map((cell) => cell.textContent);
  expect(gladius.slice(2, 5)).toEqual(["MG", "BC", "Legends"]);

  const arrow = within(rowOf("Arrow"))
    .getAllByRole("cell")
    .map((cell) => cell.textContent);
  expect(arrow.slice(2, 4)).toEqual(["ME", "Noria"]);
});

test("the players ranking keeps the full class names and has no map", () => {
  render(
    <PlayersTable
      characters={characters}
      query=""
      view="players"
      onlineNames={new Set()}
    />,
  );

  expect(
    screen.queryByRole("columnheader", { name: "Map" }),
  ).not.toBeInTheDocument();
  expect(within(rowOf("Gladius")).getAllByRole("cell")[2].textContent).toBe(
    "Magic Gladiator",
  );
});
