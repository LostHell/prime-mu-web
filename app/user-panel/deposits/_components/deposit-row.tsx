"use client";

import { ItemIcon } from "@/components/item-icon";
import {
  type DepositItemType,
  type ItemIconId,
} from "@/constants/depositable-items";
import { depositAction } from "@/lib/actions/deposit";
import { withdrawAction } from "@/lib/actions/withdraw";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { ActionLink } from "./action-link";
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

export function DepositRow({
  type,
  label,
  icon,
  warehouseCount,
  depositedCount,
  formatAmount = (n) => n.toLocaleString(),
}: DepositRowProps) {
  const [modalMode, setModalMode] = useState<TransferMode>("deposit");
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  function openModal(mode: TransferMode) {
    setFeedback(null);
    setModalMode(mode);
    setModalOpen(true);
  }

  function runAll(mode: TransferMode) {
    setFeedback(null);

    const formData = new FormData();
    formData.set("type", type);
    if (mode === "deposit") {
      formData.set("depositAll", "true");
    } else {
      formData.set("amount", String(depositedCount));
    }

    startTransition(async () => {
      const action = mode === "deposit" ? depositAction : withdrawAction;
      const result = await action({ success: false, message: "" }, formData);
      if (result.message) {
        setFeedback({ success: !!result.success, message: result.message });
      }
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
          <ActionLink
            onClick={() => openModal("deposit")}
            disabled={warehouseCount === 0}
          >
            Deposit
          </ActionLink>
          <ActionLink
            onClick={() => runAll("deposit")}
            disabled={isPending || warehouseCount === 0}
            aria-label={`Deposit all ${label}`}
          >
            All
          </ActionLink>
        </div>
        <div className="flex items-center gap-3">
          <ActionLink
            onClick={() => openModal("withdraw")}
            disabled={depositedCount === 0}
          >
            Withdraw
          </ActionLink>
          <ActionLink
            onClick={() => runAll("withdraw")}
            disabled={isPending || depositedCount === 0}
            aria-label={`Withdraw all ${label}`}
          >
            All
          </ActionLink>
        </div>
      </div>

      {feedback && (
        <p
          className={cn(
            "mt-2 text-xs",
            feedback.success ? "text-success" : "text-destructive",
          )}
        >
          {feedback.message}
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
        formatAmount={formatAmount}
      />
    </div>
  );
}
