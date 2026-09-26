"use client";

import type { DepositItemType } from "@/constants/depositable-items";
import { depositAction } from "@/lib/actions/deposit";
import { withdrawAction } from "@/lib/actions/withdraw";
import type { DepositData, ItemBalance } from "@/lib/queries/get-deposits";
import type { ActionState } from "@/lib/types/action-state";
import { startTransition, useActionState, useState } from "react";

export type TransferMode = "deposit" | "withdraw";

type TransferTarget = {
  mode: TransferMode;
  type: DepositItemType;
};

function findItem(
  items: ItemBalance[],
  type: DepositItemType | undefined,
): ItemBalance | undefined {
  return type ? items.find((item) => item.type === type) : undefined;
}

export function useDeposits(deposits: DepositData) {
  const [lastAction, setLastAction] = useState<TransferMode | null>(null);
  const [transferTarget, setTransferTarget] = useState<TransferTarget | null>(
    null,
  );
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [confirmAllTarget, setConfirmAllTarget] =
    useState<TransferTarget | null>(null);
  const [isConfirmAllOpen, setIsConfirmAllOpen] = useState(false);

  const finishTransfer = async (
    action: typeof depositAction,
    state: Parameters<typeof depositAction>[0],
    formData: FormData,
  ) => {
    const result = await action(state, formData);
    if (result.success) {
      setIsTransferOpen(false);
      setIsConfirmAllOpen(false);
    }
    return result;
  };
  const [depositState, depositFormAction, isDepositPending] = useActionState(
    (state: ActionState, formData: FormData) =>
      finishTransfer(depositAction, state, formData),
    {},
  );
  const [withdrawState, withdrawFormAction, isWithdrawPending] = useActionState(
    (state: ActionState, formData: FormData) =>
      finishTransfer(withdrawAction, state, formData),
    {},
  );

  const isPending = isDepositPending || isWithdrawPending;
  const activeState = lastAction === "withdraw" ? withdrawState : depositState;
  const actionsLocked = !deposits.isOffline || isPending;

  const transferItem = findItem(deposits.items, transferTarget?.type);
  const confirmAllItem = findItem(deposits.items, confirmAllTarget?.type);

  const transferError =
    isTransferOpen &&
    transferTarget &&
    lastAction === transferTarget.mode &&
    !activeState.success &&
    activeState.message &&
    !isPending
      ? activeState.message
      : undefined;

  const pageMessage =
    lastAction && !isTransferOpen && !isConfirmAllOpen && activeState.message
      ? { success: !!activeState.success, text: activeState.message }
      : null;

  function beginRequest(mode: TransferMode) {
    setLastAction(mode);
  }

  function dispatchTransfer(mode: TransferMode, formData: FormData) {
    if (mode === "deposit") {
      depositFormAction(formData);
    } else {
      withdrawFormAction(formData);
    }
  }

  function openTransfer(mode: TransferMode, type: DepositItemType) {
    setLastAction(null);
    setTransferTarget({ mode, type });
    setIsTransferOpen(true);
  }

  function handleTransferOpenChange(open: boolean) {
    if (!open && !isPending) setIsTransferOpen(false);
  }

  function submitTransfer(formData: FormData) {
    if (!transferTarget || !deposits.isOffline) return;
    beginRequest(transferTarget.mode);
    dispatchTransfer(transferTarget.mode, formData);
  }

  function requestAll(mode: TransferMode, type: DepositItemType) {
    setLastAction(null);
    setConfirmAllTarget({ mode, type });
    setIsConfirmAllOpen(true);
  }

  function handleConfirmAllOpenChange(open: boolean) {
    if (!open && !isPending) setIsConfirmAllOpen(false);
  }

  function submitConfirmAll() {
    if (!confirmAllItem || !confirmAllTarget || !deposits.isOffline) return;
    const formData = new FormData();
    formData.set("type", confirmAllItem.type);
    startTransition(() => {
      beginRequest(confirmAllTarget.mode);
      if (confirmAllTarget.mode === "deposit") {
        formData.set("depositAll", "true");
      } else {
        formData.set("amount", String(confirmAllItem.maxWithdrawable));
      }
      dispatchTransfer(confirmAllTarget.mode, formData);
    });
  }

  const confirmAllAmount =
    confirmAllItem && confirmAllTarget
      ? confirmAllTarget.mode === "deposit"
        ? confirmAllItem.warehouseCount
        : confirmAllItem.maxWithdrawable
      : 0;
  const confirmAllIsCapped =
    !!confirmAllItem &&
    confirmAllTarget?.mode === "withdraw" &&
    confirmAllItem.maxWithdrawable < confirmAllItem.depositedCount;

  return {
    items: deposits.items,
    isOffline: deposits.isOffline,
    actionsLocked,
    isPending,
    pageMessage,
    transfer: {
      isOpen: isTransferOpen,
      mode: transferTarget?.mode,
      item: transferItem,
      errorMessage: transferError,
      open: openTransfer,
      onOpenChange: handleTransferOpenChange,
      submit: submitTransfer,
    },
    confirmAll: {
      isOpen: isConfirmAllOpen,
      mode: confirmAllTarget?.mode,
      item: confirmAllItem,
      amount: confirmAllAmount,
      isCapped: confirmAllIsCapped,
      request: requestAll,
      onOpenChange: handleConfirmAllOpenChange,
      confirm: submitConfirmAll,
    },
  };
}
