"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { type DepositItemType } from "@/constants/depositable-items";
import { useMediaQuery } from "@/hooks/use-media-query";
import { depositAction } from "@/lib/actions/deposit";
import { withdrawAction } from "@/lib/actions/withdraw";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Stat } from "./stat";

export type TransferMode = "deposit" | "withdraw";

export type TransferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: TransferMode;
  type: DepositItemType;
  label: string;
  warehouseCount: number;
  depositedCount: number;
  maxWithdrawAmount?: number;
  formatAmount: (n: number) => string;
};

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}

export function TransferModal(props: TransferModalProps) {
  const { open, onOpenChange, mode, label } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const title = `${mode === "deposit" ? "Deposit" : "Withdraw"} ${label}`;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {open && <TransferForm {...props} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {open && <TransferForm {...props} className="px-4 pb-6" />}
      </DrawerContent>
    </Drawer>
  );
}

function TransferForm({
  mode,
  type,
  warehouseCount,
  depositedCount,
  maxWithdrawAmount,
  formatAmount,
  onOpenChange,
  className,
}: TransferModalProps & { className?: string }) {
  const limit =
    mode === "deposit" ? warehouseCount : (maxWithdrawAmount ?? depositedCount);
  const [amount, setAmount] = useState(() => clamp(1, 1, limit));
  // `mode` is fixed for the lifetime of this component (the parent remounts
  // it fresh on every open), so binding one hook to the right action is safe.
  const [state, formAction, isPending] = useActionState(
    mode === "deposit" ? depositAction : withdrawAction,
    { success: false, message: "" },
  );

  function adjustAmount(delta: number) {
    setAmount((current) => clamp(current + delta, 1, limit));
  }

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state.success, onOpenChange]);

  const newWarehouse =
    mode === "deposit" ? warehouseCount - amount : warehouseCount + amount;
  const newDeposited =
    mode === "deposit" ? depositedCount + amount : depositedCount - amount;

  function handleConfirm() {
    const formData = new FormData();
    formData.set("type", type);
    formData.set("amount", String(amount));
    // `formAction` must run inside a transition when called outside a form
    // submission (e.g. from a plain onClick), so `isPending` tracks it correctly.
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex gap-8">
        <Stat label="Warehouse" value={formatAmount(warehouseCount)} />
        <Stat label="Deposited" value={formatAmount(depositedCount)} />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Amount
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => adjustAmount(-1)}
            disabled={isPending || amount <= 1}
            aria-label="Decrease amount"
          >
            <Minus />
          </Button>
          <Input
            type="number"
            value={amount}
            min={1}
            max={limit}
            onChange={(e) => setAmount(clamp(Number(e.target.value), 1, limit))}
            className="text-center tabular-nums"
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => adjustAmount(1)}
            disabled={isPending || amount >= limit}
            aria-label="Increase amount"
          >
            <Plus />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAmount(limit)}
            disabled={isPending || limit === 0 || amount === limit}
          >
            Max
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 space-y-1 rounded-lg p-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          After transaction
        </p>
        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">Warehouse</span>
          <span className="font-medium tabular-nums">
            {formatAmount(newWarehouse)}
          </span>
        </p>
        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">Deposited</span>
          <span className="font-medium tabular-nums">
            {formatAmount(newDeposited)}
          </span>
        </p>
      </div>

      {!state.success && state.message && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={isPending || limit === 0}
        >
          {isPending
            ? "Processing…"
            : `${mode === "deposit" ? "Deposit" : "Withdraw"}`}
        </Button>
      </div>
    </div>
  );
}
