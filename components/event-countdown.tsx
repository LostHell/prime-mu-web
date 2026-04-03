"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getNextOccurrence(scheduleHours: number[]): { countdown: string; nextAt: string } {
  const safeHours = scheduleHours
    .filter((hour) => Number.isFinite(hour) && hour >= 0 && hour <= 23)
    .sort((a, b) => a - b);

  if (safeHours.length === 0) {
    return { countdown: "00:00:00", nextAt: "--:--" };
  }

  const now = new Date();

  let nextHour: number | null = null;
  for (const h of safeHours) {
    if (h > now.getHours() || (h === now.getHours() && now.getMinutes() === 0 && now.getSeconds() === 0)) {
      nextHour = h;
      break;
    }
  }

  const next = new Date(now);
  if (nextHour !== null) {
    next.setHours(nextHour, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(safeHours[0], 0, 0, 0);
  }

  const diffMs = next.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    countdown: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    nextAt: `${pad(next.getHours())}:00`,
  };
}

const EventCountdown = ({ scheduleHours, color }: { scheduleHours: number[]; color: string }) => {
  const [state, setState] = useState<{ countdown: string; nextAt: string }>(() =>
    getNextOccurrence(scheduleHours),
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      setState(getNextOccurrence(scheduleHours));
      const now = Date.now();
      const delayToNextSecond = 1000 - (now % 1000);
      timeoutId = setTimeout(tick, delayToNextSecond);
    };

    const refresh = () => setState(getNextOccurrence(scheduleHours));

    tick();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [scheduleHours]);

  return (
    <div className="flex items-center gap-2" style={{ color: "hsl(var(--muted-foreground))" }}>
      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <span className="text-xs uppercase tracking-widest">
        {"Next in "}
        <span className="font-mono font-semibold" style={{ color }}>
          {state.countdown}
        </span>
        {" · at "}
        <span className="font-semibold" style={{ color }}>
          {state.nextAt}
        </span>
      </span>
    </div>
  );
};

export default EventCountdown;
