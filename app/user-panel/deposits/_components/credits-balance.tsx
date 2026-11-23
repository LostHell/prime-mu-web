import { CREDITS_LABEL } from "@/constants/market-prices";
import { formatNumber } from "@/lib/utils/numbers";
import { Gem } from "lucide-react";
import { LabeledValue } from "./labeled-value";

type CreditsBalanceProps = {
  credits: number;
};

/** The account's credits: earned AFK in game, spent and earned on the market. Never deposited or withdrawn. */
export function CreditsBalance({ credits }: CreditsBalanceProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center">
          <Gem className="text-gold-dim size-icon-md" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold">{CREDITS_LABEL}</span>
      </div>
      <LabeledValue
        label="Balance"
        value={formatNumber(credits)}
        highlight={credits > 0}
      />
      <p className="text-muted-foreground mt-1 text-xs">
        Earned by staying online in Devias town or the Arena. Buy items on the
        market with them, or sell your items for them. Credits stay on your
        account: they are not deposited or withdrawn.
      </p>
    </div>
  );
}
