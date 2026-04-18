"use client";

import { ActionPageLayout } from "../_components/action-page-layout";
import { AddStatsForm } from "../_components/forms/add-stats-form";

export default function AddStatsPage() {
  return (
    <ActionPageLayout
      title="Add Stats"
      description="Allocate your free stat points"
      relevantFields={["freePoints", "level", "resets"]}
    >
      {(character) => <AddStatsForm character={character} />}
    </ActionPageLayout>
  );
}
