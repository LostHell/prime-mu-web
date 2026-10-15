import type { Metadata } from "next";
import { CharacterOverview } from "./_components/character-overview";

export const metadata: Metadata = {
  title: "Character overview",
};

export default function UserPanelPage() {
  return <CharacterOverview />;
}
