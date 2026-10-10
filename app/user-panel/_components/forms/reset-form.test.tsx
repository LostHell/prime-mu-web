import { render, screen } from "@testing-library/react";
import { MAX_RESETS } from "@/constants/resets";
import { type CharacterWithNextReset } from "@/lib/types/character";
import { UserPanelProvider } from "../../_context/user-panel-context";
import { ResetForm } from "./reset-form";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/lib/actions/reset-character", () => ({
  resetCharacterAction: jest.fn(),
}));

const character = (resets: number, ready: boolean): CharacterWithNextReset => ({
  name: "Wizard",
  class: "Soul Master",
  classId: 1,
  level: ready ? 300 : 208,
  resets,
  zen: 685_609_877,
  pkCount: 0,
  freePoints: 0,
  stats: { str: 18, agi: 18, vit: 15, ene: 30 },
  nextReset: {
    equipmentStatus: ready ? "empty" : "equipped",
    resultingLevel: 1,
    resultingAvailablePoints: 15_220,
  },
});

const renderForm = (resets: number, ready = false) => {
  const panelCharacter = character(resets, ready);
  return render(
    <UserPanelProvider
      account={{ isOffline: true }}
      characters={[panelCharacter]}
    >
      <ResetForm character={panelCharacter} />
    </UserPanelProvider>,
  );
};

test("tells a maxed character they cannot reset again", () => {
  renderForm(MAX_RESETS);
  expect(
    screen.getByText(`You have reached the maximum of ${MAX_RESETS} resets.`),
  ).toBeInTheDocument();
  expect(
    screen.getByText(`${MAX_RESETS} / ${MAX_RESETS} maximum`),
  ).toBeInTheDocument();
  expect(screen.queryByText("After this reset")).not.toBeInTheDocument();
  expect(screen.queryByText("Unavailable")).not.toBeInTheDocument();
  expect(screen.queryByText("Unequip all items")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Reset Character" }),
  ).not.toBeInTheDocument();
});

test("shows the next reset while the character is under the limit", () => {
  renderForm(0, true);
  expect(screen.getByText("After this reset")).toBeInTheDocument();
  expect(screen.getByText("1,000")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Reset Character" }),
  ).toBeInTheDocument();
});
