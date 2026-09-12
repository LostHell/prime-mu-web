import { ItemIcon } from "@/components/item-icon";
import { Button } from "@/components/ui/button";
import { type ItemBalance as ItemBalanceData } from "@/lib/queries/get-deposits";
import { formatNumber } from "@/lib/utils/numbers";
import { LabeledValue } from "./labeled-value";

type ItemBalanceProps = {
  item: ItemBalanceData;
  actionsLocked: boolean;
  onDeposit: () => void;
  onDepositAll: () => void;
  onWithdraw: () => void;
  onWithdrawAll: () => void;
};

export function ItemBalance({
  item,
  actionsLocked,
  onDeposit,
  onDepositAll,
  onWithdraw,
  onWithdrawAll,
}: ItemBalanceProps) {
  const { label, icon, warehouseCount, depositedCount, maxWithdrawable } = item;
  const canDeposit = !actionsLocked && warehouseCount > 0;
  const canWithdraw = !actionsLocked && maxWithdrawable > 0;

  return (
    <div className="border-border/50 border-b py-4 last:border-b-0">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden">
          <ItemIcon
            group={icon.group}
            index={icon.index}
            className="size-full"
          />
        </div>
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <LabeledValue label="Warehouse" value={formatNumber(warehouseCount)} />
        <LabeledValue
          label="Deposited"
          value={formatNumber(depositedCount)}
          highlight={depositedCount > 0}
        />

        <div className="flex items-center gap-3">
          <Button
            variant="link"
            onClick={onDeposit}
            disabled={!canDeposit}
            aria-label={`Deposit ${label}`}
          >
            Deposit
          </Button>
          <Button
            variant="link"
            onClick={onDepositAll}
            disabled={!canDeposit}
            aria-label={`Deposit all ${label}`}
          >
            All
          </Button>
        </div>
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-3">
            <Button
              variant="link"
              onClick={onWithdraw}
              disabled={!canWithdraw}
              aria-label={`Withdraw ${label}`}
            >
              Withdraw
            </Button>
            <Button
              variant="link"
              onClick={onWithdrawAll}
              disabled={!canWithdraw}
              aria-label={`Withdraw all ${label}`}
            >
              All
            </Button>
          </div>
          {item.withdrawBlockedReason && (
            <p className="text-muted-foreground text-xs">
              {item.withdrawBlockedReason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
