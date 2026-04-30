"use client";

import { UserPanelPageLayout } from "../_components/user-panel-page-layout";
import { DepositsForm } from "./_components/deposits-form";

export default function DepositsPage() {
  return (
    <UserPanelPageLayout
      title="Deposits"
      description="Deposit items and zen from your warehouse"
    >
      <DepositsForm />
    </UserPanelPageLayout>
  );
}
