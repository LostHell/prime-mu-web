"use client";

import { ActionPageLayout } from "@/app/user-panel/_components/action-page-layout";
import { ResetForm } from "./reset-form";

export function ResetPage() {
  return (
    <ActionPageLayout
      title="Reset Character"
      description="Review the requirements and your character’s stats after resetting"
    >
      {(character) => <ResetForm character={character} />}
    </ActionPageLayout>
  );
}
