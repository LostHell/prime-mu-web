"use client";

import { ArrowDownToLine, CircleDollarSign, Package, Wallet } from "lucide-react";

function DepositsForm() {
  return (
    <div className="space-y-6">
      {/* Deposit Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Deposit Options
        </h3>

        {/* Zen Deposit */}
        <div className="rounded-xl border border-border/50 p-4 hover:border-gold/30 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <CircleDollarSign className="size-6 text-gold" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Deposit Zen</h4>
              <p className="text-sm text-muted-foreground">
                Transfer zen from your warehouse to website balance
              </p>
            </div>
            <ArrowDownToLine className="size-5 text-muted-foreground group-hover:text-gold transition-colors" />
          </div>
        </div>

        {/* Items Deposit - Coming Soon */}
        <div className="rounded-xl border border-border/30 p-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
              <Package className="size-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-muted-foreground">
                  Deposit Items
                </h4>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground/70">
                Transfer jewels and stones from warehouse
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Website Balance */}
      <div className="rounded-xl border border-border/50 p-4 bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="size-5 text-gold" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Website Balance
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Zen</p>
            <p className="text-xl font-bold tabular-nums text-gold">0</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Credits</p>
            <p className="text-xl font-bold tabular-nums text-gold">0</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-center py-4 rounded-lg bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Deposits are processed from your character&apos;s warehouse.
          <br />
          Make sure your character is logged off before depositing.
        </p>
      </div>
    </div>
  );
}

export default function DepositsPage() {
  // TODO - Fix layout - character selection is NOT NEEDED
  return (
    <DepositsForm />
  );
}
