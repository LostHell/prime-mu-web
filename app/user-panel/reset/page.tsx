"use client";

import { ActionPageLayout } from "../_components/action-page-layout";
import { ResetForm } from "../_components/forms/reset-form";

export default function ResetPage() {
  return (
    <ActionPageLayout
      title="Reset Character"
      description="Review the requirements and your character’s stats after resetting"
    >
      {(character) => <ResetForm character={character} />}
    </ActionPageLayout>
  );
}
