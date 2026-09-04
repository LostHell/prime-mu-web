"use client";

import { ItemIcon } from "@/components/item-icon";
import { Button } from "@/components/ui/button";
import {
  type DepositItemType,
  type ItemIconId,
} from "@/constants/depositable-items";
import { depositAction } from "@/lib/actions/deposit";
import { withdrawAction } from "@/lib/actions/withdraw";
import { MAX_WAREHOUSE_MONEY } from "@/lib/game/constants/warehouse";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/numbers";
import { startTransition, useActionState, useState } from "react";
import { Stat } from "./stat";
import { TransferModal, type TransferMode } from "./transfer-modal";

type DepositRowProps = {
  type: DepositItemType;
  label: string;
  icon: ItemIconId;
  warehouseCount: number;
  depositedCount: number;
  formatAmount?: (n: number) => string;
};

const INITIAL_STATE = { success: false, message: "" };

/** Plain-text, underlined look for the inline row actions below (e.g. "Deposit
 * / All"), layered onto `Button`'s non-decorative `link` variant. */
const ROW_ACTION_CLASSNAME =
  "text-muted-foreground decoration-muted-foreground hover:text-gold hover:decoration-gold disabled:text-muted-foreground h-auto p-0 text-sm font-medium underline underline-offset-4 disabled:no-underline disabled:opacity-60";

type RowActionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
};

/** One of the "Deposit / All" or "Withdraw / All" links in a row. Local to
 * this file since it's just a shorthand for the repeated Button props below. */
function RowActionButton({
  onClick,
  disabled,
  ariaLabel,
  children,
}: RowActionButtonProps) {
  return (
    <Button
      variant="link"
      size="xs"
      className={ROW_ACTION_CLASSNAME}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

export function DepositRow({
  type,
  label,
  icon,
  warehouseCount,
  depositedCount,
  formatAmount = formatNumber,
}: DepositRowProps) {
  const [modalMode, setModalMode] = useState<TransferMode>("deposit");
  const [modalOpen, setModalOpen] = useState(false);
  // Tracks which of the two independent action states below to surface,
  // since only one "All" action can be in flight/settled at a time.
  const [lastAction, setLastAction] = useState<TransferMode | null>(null);

  const [depositState, depositFormAction, isDepositPending] = useActionState(
    depositAction,
    INITIAL_STATE,
  );
  const [withdrawState, withdrawFormAction, isWithdrawPending] = useActionState(
    withdrawAction,
    INITIAL_STATE,
  );

  const isPending = isDepositPending || isWithdrawPending;
  const activeState = lastAction === "withdraw" ? withdrawState : depositState;

  // Zen can't be withdrawn past warehouse.Money's UnsignedInt capacity, so cap
  // what's offered here instead of letting the user hit that error below.
  const maxWithdrawable =
    type === "zen"
      ? Math.max(
          0,
          Math.min(depositedCount, MAX_WAREHOUSE_MONEY - warehouseCount),
        )
      : depositedCount;

  function handleOpenModal(mode: TransferMode) {
    setModalMode(mode);
    setModalOpen(true);
  }

  function handleDepositAll() {
    setLastAction("deposit");
    const formData = new FormData();
    formData.set("type", type);
    formData.set("depositAll", "true");

    startTransition(() => {
      depositFormAction(formData);
    });
  }

  function handleWithdrawAll() {
    setLastAction("withdraw");
    const formData = new FormData();
    formData.set("type", type);
    formData.set("amount", String(maxWithdrawable));
    startTransition(() => {
      withdrawFormAction(formData);
    });
  }

  return (
    <div className="border-border/50 border-b py-4 last:border-b-0">
      <div className="mb-3 flex items-center gap-3">
        <div className="border-border/50 bg-muted flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border">
          <ItemIcon
            group={icon.group}
            index={icon.index}
            className="size-full"
          />
        </div>
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <Stat label="Warehouse" value={formatAmount(warehouseCount)} />
        <Stat
          label="Deposited"
          value={formatAmount(depositedCount)}
          highlight={depositedCount > 0}
        />

        <div className="flex items-center gap-3">
          <RowActionButton
            onClick={() => handleOpenModal("deposit")}
            disabled={warehouseCount === 0}
          >
            Deposit
          </RowActionButton>
          <RowActionButton
            onClick={handleDepositAll}
            disabled={isPending || warehouseCount === 0}
            ariaLabel={`Deposit all ${label}`}
          >
            All
          </RowActionButton>
        </div>
        <div className="flex items-center gap-3">
          <RowActionButton
            onClick={() => handleOpenModal("withdraw")}
            disabled={maxWithdrawable === 0}
          >
            Withdraw
          </RowActionButton>
          <RowActionButton
            onClick={handleWithdrawAll}
            disabled={isPending || maxWithdrawable === 0}
            ariaLabel={`Withdraw all ${label}`}
          >
            All
          </RowActionButton>
        </div>
      </div>

      {!modalOpen && lastAction && activeState.message && (
        <p
          className={cn(
            "mt-2 text-xs",
            activeState.success ? "text-success" : "text-destructive",
          )}
        >
          {activeState.message}
        </p>
      )}

      <TransferModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        type={type}
        label={label}
        warehouseCount={warehouseCount}
        depositedCount={depositedCount}
        maxWithdrawAmount={maxWithdrawable}
        formatAmount={formatAmount}
      />
    </div>
  );
}
