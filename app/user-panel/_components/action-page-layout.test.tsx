import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { Character } from "@/lib/types/character";
import { UserPanelProvider } from "../_context/user-panel-context";
import { ActionPageLayout } from "./action-page-layout";
import { UserPanelNav } from "./user-panel-nav";

jest.mock("next/navigation", () => ({
  usePathname: () => "/user-panel/add-stats",
  useRouter: () => ({ push: jest.fn() }),
}));

const first: Character = {
  name: "Knight",
  class: "Dark Knight",
  level: 100,
  resets: 2,
  zen: 1000,
  pkCount: 0,
  freePoints: 20,
  stats: { str: 30, agi: 20, vit: 25, ene: 10, cmd: 0 },
};
const second: Character = { ...first, name: "Wizard", class: "Dark Wizard" };

function Draft({ character }: { character: Character }) {
  const [points, setPoints] = useState("");
  return (
    <>
      <p>Available: {character.freePoints}</p>
      <input
        aria-label="Draft points"
        value={points}
        onChange={(event) => setPoints(event.target.value)}
      />
    </>
  );
}
function Panel({ characters }: { characters: Character[] }) {
  return (
    <UserPanelProvider characters={characters}>
      <UserPanelNav />
      <ActionPageLayout title="Add stats">
        {(character) => <Draft character={character} />}
      </ActionPageLayout>
    </UserPanelProvider>
  );
}

test("switching sidebar characters keeps the service route and clears the previous character's draft", () => {
  render(<Panel characters={[first, second]} />);
  expect(
    screen.getByRole("link", { name: /Knight Dark Knight/ }),
  ).toHaveAttribute("aria-current", "true");
  fireEvent.change(screen.getByRole("textbox", { name: "Draft points" }), {
    target: { value: "12" },
  });
  const wizard = screen.getByRole("link", { name: /Wizard Dark Wizard/ });
  expect(wizard).toHaveAttribute("href", "/user-panel/add-stats");
  fireEvent.click(wizard);
  expect(wizard).toHaveAttribute("aria-current", "true");
  expect(screen.getByRole("textbox", { name: "Draft points" })).toHaveValue("");
});

test("selected character uses refreshed data and falls back when removed", () => {
  const { rerender } = render(<Panel characters={[first, second]} />);
  fireEvent.click(screen.getByRole("link", { name: /Wizard Dark Wizard/ }));
  rerender(<Panel characters={[first, { ...second, freePoints: 7 }]} />);
  expect(screen.getByText("Available: 7")).toBeInTheDocument();
  rerender(<Panel characters={[first]} />);
  expect(screen.getByText("Available: 20")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Knight Dark Knight/ }),
  ).toHaveAttribute("aria-current", "true");
});

test("accounts without characters show an empty state instead of service forms", () => {
  render(<Panel characters={[]} />);
  expect(
    screen.getByRole("heading", { name: "No characters yet" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("textbox", { name: "Draft points" }),
  ).not.toBeInTheDocument();
});

test("renders the current service label in the initial server HTML before opening the menu", () => {
  const html = renderToString(<Panel characters={[first]} />);
  const document = new DOMParser().parseFromString(html, "text/html");
  expect(document.querySelector('[role="combobox"]')?.textContent).toContain(
    "Add stats",
  );
});
