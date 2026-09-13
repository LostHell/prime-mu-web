"use client";

import { parseAmountInput } from "@/lib/utils/numbers";
import { useState } from "react";

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}

function initialAmount(limit: number) {
  return limit > 0 ? 1 : 0;
}

export function useTransferAmount(limit: number) {
  const [amount, setAmount] = useState(() => initialAmount(limit));
  const safeAmount = amount === 0 ? 0 : clamp(amount, 1, limit);

  if (amount !== 0 && amount !== safeAmount) {
    setAmount(safeAmount);
  }

  function setFromInput(value: string) {
    const parsed = parseAmountInput(value);
    if (parsed === null) return;
    if (parsed === 0) {
      setAmount(0);
      return;
    }
    setAmount(clamp(parsed, 1, limit));
  }

  return {
    amount,
    safeAmount,
    setFromInput,
    setToMax: () => setAmount(limit),
  };
}
