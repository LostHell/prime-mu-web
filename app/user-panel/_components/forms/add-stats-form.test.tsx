import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { addStatsAction } from "@/lib/actions/add-stats";
import type { Character } from "@/lib/types/character";
import { AddStatsForm } from "./add-stats-form";

jest.mock("@/lib/actions/add-stats", () => ({ addStatsAction: jest.fn() }));

const character: Character = {
  name: "Knight",
  class: "Dark Knight",
  level: 100,
  resets: 2,
  zen: 1000,
  pkCount: 0,
  freePoints: 20,
  stats: { str: 30, agi: 20, vit: 25, ene: 10, cmd: 0 },
};

test("keeps an allocation after rejection and clears it after a successful retry", async () => {
  jest
    .mocked(addStatsAction)
    .mockResolvedValueOnce({ success: false, message: "Account is online." })
    .mockResolvedValueOnce({ success: true, message: "Points applied." });
  render(<AddStatsForm character={character} />);
  const input = screen.getByRole("spinbutton", {
    name: "Points to add to strength",
  });
  fireEvent.change(input, { target: { value: "12" } });
  fireEvent.click(screen.getByRole("button", { name: "Apply 12 points" }));
  expect(await screen.findByText("Account is online.")).toBeInTheDocument();
  expect(input).toHaveValue(12);
  fireEvent.click(screen.getByRole("button", { name: "Apply 12 points" }));
  expect(await screen.findByText("Points applied.")).toBeInTheDocument();
  await waitFor(() => expect(input).toHaveValue(null));
  expect(jest.mocked(addStatsAction).mock.calls[1][1].get("str")).toBe("12");
});
