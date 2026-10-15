import type { Metadata } from "next";
import { AddStatsPage } from "./_components/add-stats-page";

export const metadata: Metadata = {
  title: "Add Stats",
};

export default function Page() {
  return <AddStatsPage />;
}
