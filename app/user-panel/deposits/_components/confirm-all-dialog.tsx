import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type ItemBalance } from "@/lib/queries/get-deposits";
import { formatNumber } from "@/lib/utils/numbers";
import { type TransferMode } from "../_hooks/use-deposits";

type ConfirmAllDialogProps = {
  open: boolean;
  mode: TransferMode;
  item: ItemBalance;
  amount: number;
  isCapped: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmAllDialog({
  open,
  mode,
  item,
  amount,
  isCapped,
  isPending,
  onOpenChange,
  onConfirm,
}: ConfirmAllDialogProps) {
  const verb = mode === "deposit" ? "Deposit" : "Withdraw";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {verb} all {item.label}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will {mode} {formatNumber(amount)} {item.label}
            {mode === "deposit"
              ? " from your warehouse."
              : " to your warehouse."}
            {isCapped
              ? ` Only ${formatNumber(item.maxWithdrawable)} of ${formatNumber(item.depositedCount)} fit.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
