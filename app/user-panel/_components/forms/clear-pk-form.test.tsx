import { render, screen } from "@testing-library/react";
import { type Character } from "@/lib/types/character";
import { ClearPkForm } from "./clear-pk-form";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/lib/actions/clear-pk", () => ({ clearPkAction: jest.fn() }));

const character = (pkCount: number, zen: number): Character => ({
  name: "Knight",
  class: "Dark Knight",
  classId: 16,
  level: 100,
  resets: 0,
  zen,
  pkCount,
  pkLevel: 6,
  pkTime: 0,
  freePoints: 0,
  stats: { str: 28, agi: 20, vit: 25, ene: 10 },
});

test("says the character is short of zen when the clear costs more than they carry", () => {
  render(<ClearPkForm character={character(1, 0)} />);
  expect(screen.getByText("Not enough Zen")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Clear PK Status" }),
  ).toBeDisabled();
});

test("says the clear is available when the character can pay", () => {
  render(<ClearPkForm character={character(1, 15_000_000)} />);
  expect(screen.getByText("Available to clear")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Clear PK Status" })).toBeEnabled();
});
