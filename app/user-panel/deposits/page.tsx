import { auth } from "@/auth";
import { getDeposits } from "@/lib/queries/get-deposits";
import { redirect } from "next/navigation";
import { UserPanelPageLayout } from "../_components/user-panel-page-layout";
import { DepositsContent } from "./_components/deposits-content";

export default async function DepositsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const deposits = await getDeposits(session.user.id);

  return (
    <UserPanelPageLayout
      title="Deposits"
      description="Deposit and withdraw zen and items from your warehouse"
    >
      <DepositsContent deposits={deposits} />
    </UserPanelPageLayout>
  );
}
