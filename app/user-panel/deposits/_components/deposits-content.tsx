"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import type { DepositData } from "@/lib/queries/get-deposits";
import { Fragment } from "react";
import { useDeposits } from "../_hooks/use-deposits";
import { ConfirmAllDialog } from "./confirm-all-dialog";
import { ItemBalance } from "./item-balance";
import { TransferForm } from "./transfer-form";
import { TransferModal } from "./transfer-modal";

type DepositsContentProps = {
  deposits: DepositData;
};

export function DepositsContent({ deposits }: DepositsContentProps) {
  const {
    items,
    isOffline,
    actionsLocked,
    isPending,
    pageMessage,
    transfer,
    confirmAll,
  } = useDeposits(deposits);

  return (
    <div className="flex flex-col gap-6">
      {!isOffline && (
        <Alert variant="destructive">
          <AlertDescription>
            Your account must be offline to deposit or withdraw.
          </AlertDescription>
        </Alert>
      )}

      {items.map((item, index) => (
        <Fragment key={item.type}>
          {index > 0 && <Separator />}
          <ItemBalance
            item={item}
            actionsLocked={actionsLocked}
            onDeposit={() => transfer.open("deposit", item.type)}
            onDepositAll={() => confirmAll.request("deposit", item.type)}
            onWithdraw={() => transfer.open("withdraw", item.type)}
            onWithdrawAll={() => confirmAll.request("withdraw", item.type)}
          />
        </Fragment>
      ))}

      {pageMessage && (
        <Alert variant={pageMessage.success ? "success" : "destructive"}>
          <AlertDescription>{pageMessage.text}</AlertDescription>
        </Alert>
      )}

      {transfer.item && transfer.mode && (
        <TransferModal
          open={transfer.isOpen}
          onOpenChange={transfer.onOpenChange}
          title={`${transfer.mode === "deposit" ? "Deposit" : "Withdraw"} ${transfer.item.label}`}
          description={`Enter how much ${transfer.item.label} to ${transfer.mode} between your warehouse and website balance.`}
          isPending={isPending}
        >
          <TransferForm
            key={`${transfer.item.type}-${transfer.mode}`}
            mode={transfer.mode}
            type={transfer.item.type}
            warehouseCount={transfer.item.warehouseCount}
            depositedCount={transfer.item.depositedCount}
            limit={
              transfer.mode === "deposit"
                ? transfer.item.warehouseCount
                : transfer.item.maxWithdrawable
            }
            isPending={isPending}
            errorMessage={transfer.errorMessage}
            formAction={transfer.submit}
            onCancel={() => transfer.onOpenChange(false)}
          />
        </TransferModal>
      )}

      {confirmAll.item && confirmAll.mode && (
        <ConfirmAllDialog
          open={confirmAll.isOpen}
          mode={confirmAll.mode}
          item={confirmAll.item}
          amount={confirmAll.amount}
          isCapped={confirmAll.isCapped}
          isPending={isPending}
          onOpenChange={confirmAll.onOpenChange}
          onConfirm={confirmAll.confirm}
        />
      )}
    </div>
  );
}
