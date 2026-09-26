"use client";

import { SERVER_TIME_ZONE } from "@/constants/server";
import { formatCountdown, nextEventTime } from "@/lib/utils/event-schedule";
import { useEffect, useState } from "react";

export default function EventCountdown({
  scheduleHours,
  colorClass,
}: {
  scheduleHours: number[];
  colorClass: string;
}) {
  const [countdown, setCountdown] = useState("--:--:--");
  useEffect(() => {
    let next: number | null = null;
    const refresh = () => {
      const now = Date.now();
      if (next === null || next <= now)
        next = nextEventTime(scheduleHours, now, SERVER_TIME_ZONE);
      setCountdown(next === null ? "Unavailable" : formatCountdown(next - now));
    };
    refresh();
    const timer = setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [scheduleHours]);

  return (
    <div className="text-muted-foreground flex flex-col items-end gap-1">
      <span className="font-serif font-semibold tracking-widest uppercase">
        <span className={colorClass}>{countdown}</span>
      </span>
      <span className="text-xs">{SERVER_TIME_ZONE}</span>
    </div>
  );
}
