"use client";

import { ActionPageLayout } from "@/app/user-panel/_components/action-page-layout";
import { AddStatsForm } from "./add-stats-form";

export function AddStatsPage() {
  return (
    <ActionPageLayout
      title="Add Stats"
      description="Allocate your free stat points"
    >
      {(character) => <AddStatsForm character={character} />}
    </ActionPageLayout>
  );
}
