"use client";

import {
  DEPOSITABLE_ITEMS,
  type DepositItemType,
} from "@/constants/depositable-items";
import type { DepositData } from "@/lib/queries/get-deposit-data";
import { DepositRow } from "./deposit-row";

type DepositsContentProps = {
  data: DepositData;
};

const ALL_ITEMS: DepositItemType[] = [
  "zen",
  "rena",
  "jewelOfBless",
  "jewelOfSoul",
  "jewelOfLife",
  "jewelOfCreation",
  "jewelOfChaos",
];

export function DepositsContent({ data }: DepositsContentProps) {
  const { warehouseZen, warehouseCounts, balance } = data;

  return (
    <div>
      {ALL_ITEMS.map((type) => {
        const config = DEPOSITABLE_ITEMS[type];
        const warehouseCount =
          type === "zen" ? warehouseZen : warehouseCounts[type];
        const depositedCount =
          type === "zen"
            ? balance.Zen
            : config.dbField
              ? balance[config.dbField]
              : 0;

        return (
          <DepositRow
            key={type}
            type={type}
            label={config.label}
            icon={config.icon}
            warehouseCount={warehouseCount}
            depositedCount={depositedCount}
          />
        );
      })}

      <p className="text-muted-foreground mt-4 text-xs">
        Your account must be offline to deposit or withdraw.
      </p>
    </div>
  );
}
