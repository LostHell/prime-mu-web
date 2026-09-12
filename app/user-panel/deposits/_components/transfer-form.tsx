"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type DepositItemType } from "@/constants/depositable-items";
import { formatNumber } from "@/lib/utils/numbers";
import { type TransferMode } from "../_hooks/use-deposits";
import { useTransferAmount } from "../_hooks/use-transfer-amount";
import { LabeledValue } from "./labeled-value";

export type TransferFormProps = {
  mode: TransferMode;
  type: DepositItemType;
  warehouseCount: number;
  depositedCount: number;
  limit: number;
  isPending: boolean;
  errorMessage?: string;
  formAction: (formData: FormData) => void;
  onCancel: () => void;
};

export function TransferForm({
  mode,
  type,
  warehouseCount,
  depositedCount,
  limit,
  isPending,
  errorMessage,
  formAction,
  onCancel,
}: TransferFormProps) {
  const { amount, safeAmount, setFromInput, setToMax } =
    useTransferAmount(limit);

  const newWarehouse =
    mode === "deposit"
      ? warehouseCount - safeAmount
      : warehouseCount + safeAmount;
  const newDeposited =
    mode === "deposit"
      ? depositedCount + safeAmount
      : depositedCount - safeAmount;
  const canSubmit = !isPending && safeAmount >= 1 && safeAmount <= limit;
  const verb = mode === "deposit" ? "Deposit" : "Withdraw";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="amount" value={String(safeAmount)} />

      <div className="flex gap-8">
        <LabeledValue label="Warehouse" value={formatNumber(warehouseCount)} />
        <LabeledValue label="Deposited" value={formatNumber(depositedCount)} />
      </div>

      <Field>
        <FieldLabel
          htmlFor="transfer-amount"
          className="text-muted-foreground text-xs font-medium tracking-wider uppercase"
        >
          Amount
        </FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            id="transfer-amount"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={amount === 0 ? "" : String(amount)}
            onChange={(event) => setFromInput(event.target.value)}
            className="text-center tabular-nums"
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            onClick={setToMax}
            disabled={isPending || limit === 0 || amount === limit}
          >
            Max
          </Button>
        </div>
      </Field>

      <div className="bg-muted/30 space-y-1 rounded-lg p-3">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          After transaction
        </p>
        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">Warehouse</span>
          <span className="font-medium tabular-nums">
            {formatNumber(newWarehouse)}
          </span>
        </p>
        <p className="flex justify-between text-sm">
          <span className="text-muted-foreground">Deposited</span>
          <span className="font-medium tabular-nums">
            {formatNumber(newDeposited)}
          </span>
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {isPending ? "Processing…" : verb}
        </Button>
      </div>
    </form>
  );
}
