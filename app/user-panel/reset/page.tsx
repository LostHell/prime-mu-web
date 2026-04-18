"use client";

import { ActionPageLayout } from "../_components/action-page-layout";
import { ResetForm } from "../_components/forms/reset-form";

export default function ResetPage() {
  return (
    <ActionPageLayout
      title="Reset Character"
      description="Reset your character to level 1 and gain bonus points"
      relevantFields={["level", "resets", "zen"]}
    >
      {(character) => <ResetForm character={character} />}
    </ActionPageLayout>
  );
}
