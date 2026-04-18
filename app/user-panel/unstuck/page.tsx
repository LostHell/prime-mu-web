"use client";

import { ActionPageLayout } from "../_components/action-page-layout";
import { UnstuckForm } from "../_components/forms/unstuck-form";

export default function UnstuckPage() {
  return (
    <ActionPageLayout
      title="Unstuck"
      description="Teleport your character to a safe location"
      relevantFields={["level", "resets"]}
    >
      {(character) => <UnstuckForm character={character} />}
    </ActionPageLayout>
  );
}
