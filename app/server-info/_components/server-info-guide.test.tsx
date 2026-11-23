import { render, screen, within } from "@testing-library/react";
import ServerGuideNav from "./server-guide-nav";
import ServerInfoGuide from "./server-info-guide";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

// Item.txt's names: only the Box of Luck (14,11) the test config's quest gives.
jest.mock("@/lib/game/item-database", () => ({
  getItemDefinition: ({ group, index }: { group: number; index: number }) =>
    group === 14 && index === 11 ? { name: "Box of Luck" } : undefined,
}));

test("shows the public server settings and live counts", () => {
  render(<ServerInfoGuide online={12} registered={340} guilds={9} />);

  expect(screen.getByRole("heading", { name: "Server" })).toBeInTheDocument();
  expect(screen.getByText("12")).toBeInTheDocument();
  expect(screen.getByText("340")).toBeInTheDocument();
  expect(screen.getByText("9")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View rankings" })).toHaveAttribute(
    "href",
    "/rankings",
  );
  expect(screen.getByRole("link", { name: "Download client" })).toHaveAttribute(
    "href",
    "/downloads",
  );
  expect(screen.queryByText(/Donations/)).not.toBeInTheDocument();
});

test("lists every enabled event with its schedule, length and bonus", () => {
  render(<ServerInfoGuide online={0} registered={0} guilds={0} />);

  expect(screen.getByText("Happy Hour")).toBeInTheDocument();
  expect(screen.getByText("20:00")).toBeInTheDocument();
  expect(screen.getByText("60 min · +150% experience")).toBeInTheDocument();
});

test("lists the quest window's quests, closed in blocks, with what they need, ask and give", () => {
  render(<ServerInfoGuide online={0} registered={0} guilds={0} />);

  expect(screen.getByRole("heading", { name: "Quests" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Quests" })).toHaveAttribute(
    "href",
    "#quests",
  );
  const block = screen.getByText("Quests 1–2").closest("details");
  expect(block).not.toBeNull();
  expect(block).not.toHaveAttribute("open");

  const inBlock = within(block as HTMLElement);
  expect(inBlock.getByText("Quest 1")).toBeInTheDocument();
  expect(inBlock.getByText("· Slay 50 Spiders")).toBeInTheDocument();
  expect(inBlock.getByText("· Slay 50 Budge Dragons")).toBeInTheDocument();
  expect(
    screen.getByText(
      "After the class change (Dark Wizard, Dark Knight, Fairy Elf) or with 1 reset (Magic Gladiator)",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText("50 × Spider")).toBeInTheDocument();
  expect(screen.getByText("10,000,000 zen")).toBeInTheDocument();
  expect(screen.getByText("After quest 1")).toBeInTheDocument();
  expect(screen.getByText("3 × Heart of Love")).toBeInTheDocument();
  expect(screen.getByText("5 level-up points")).toBeInTheDocument();
});

test("leaves the quests out of the guide's menu while the page has none", () => {
  render(<ServerGuideNav showQuests={false} />);

  expect(screen.getByRole("link", { name: "Character" })).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Quests" }),
  ).not.toBeInTheDocument();
});
