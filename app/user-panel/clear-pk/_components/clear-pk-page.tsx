"use client";

import { ActionPageLayout } from "@/app/user-panel/_components/action-page-layout";
import { ClearPkForm } from "./clear-pk-form";

export function ClearPkPage() {
  return (
    <ActionPageLayout
      title="Clear PK"
      description="Remove your Player Killer status"
    >
      {(character) => <ClearPkForm character={character} />}
    </ActionPageLayout>
  );
}
