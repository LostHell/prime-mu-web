import {
  ArrowDownToLine,
  CircleDollarSign,
  Package,
  Wallet,
} from "lucide-react";

export function DepositsForm() {
  return (
    <div className="space-y-6">
      {/* Deposit Options */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Deposit Options
        </h3>

        {/* Zen Deposit */}
        <div className="border-border/50 hover:border-gold/30 group cursor-pointer rounded-xl border p-4 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-gold/10 group-hover:bg-gold/20 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
              <CircleDollarSign className="text-gold size-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Deposit Zen</h4>
              <p className="text-muted-foreground text-sm">
                Transfer zen from your warehouse to website balance
              </p>
            </div>
            <ArrowDownToLine className="text-muted-foreground group-hover:text-gold size-5 transition-colors" />
          </div>
        </div>

        {/* Items Deposit - Coming Soon */}
        <div className="border-border/30 cursor-not-allowed rounded-xl border p-4 opacity-50">
          <div className="flex items-center gap-4">
            <div className="bg-muted/30 flex h-12 w-12 items-center justify-center rounded-lg">
              <Package className="text-muted-foreground size-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-muted-foreground font-medium">
                  Deposit Items
                </h4>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-muted-foreground/70 text-sm">
                Transfer jewels and stones from warehouse
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Website Balance */}
      <div className="border-border/50 bg-muted/20 rounded-xl border p-4">
        <div className="mb-4 flex items-center gap-3">
          <Wallet className="text-gold size-5" />
          <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Website Balance
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground mb-1 text-xs">Zen</p>
            <p className="text-gold text-xl font-bold tabular-nums">0</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">Credits</p>
            <p className="text-gold text-xl font-bold tabular-nums">0</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted/30 rounded-lg py-4 text-center">
        <p className="text-muted-foreground text-xs">
          Deposits are processed from your character&apos;s warehouse.
          <br />
          Make sure your character is logged off before depositing.
        </p>
      </div>
    </div>
  );
}
