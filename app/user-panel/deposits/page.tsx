import { auth } from "@/auth";
import { UserPanelPageLayout } from "../_components/user-panel-page-layout";
import { getDepositData } from "@/lib/queries/get-deposit-data";
import { redirect } from "next/navigation";
import { DepositsContent } from "./_components/deposits-content";

export default async function DepositsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDepositData(session.user.id);

  return (
    <UserPanelPageLayout
      title="Deposits"
      description="Deposit and withdraw zen and items from your warehouse"
    >
      <DepositsContent data={data} />
    </UserPanelPageLayout>
  );
}
