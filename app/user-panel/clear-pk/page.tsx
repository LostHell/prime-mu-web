"use client";

import { ActionPageLayout } from "../_components/action-page-layout";
import { ClearPkForm } from "../_components/forms/clear-pk-form";

export default function ClearPkPage() {
  return (
    <ActionPageLayout
      title="Clear PK"
      description="Remove your Player Killer status"
      relevantFields={["pkCount", "level", "resets"]}
    >
      {(character) => <ClearPkForm character={character} />}
    </ActionPageLayout>
  );
}
