"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getNextOccurrence(scheduleHours: number[]): { countdown: string; nextAt: string } {
  const safeTimes = scheduleHours
    .filter((time) => Number.isFinite(time) && time >= 0 && time < 24)
    .map((time) => {
      const hour = Math.floor(time);
      const minute = Math.round((time - hour) * 60);

      if (!Number.isInteger(hour) || !Number.isInteger(minute) || minute < 0 || minute > 59) {
        return null;
      }

      return { hour, minute };
    })
    .filter((entry): entry is { hour: number; minute: number } => entry !== null)
    .sort((a, b) => (a.hour === b.hour ? a.minute - b.minute : a.hour - b.hour));

  if (safeTimes.length === 0) {
    return { countdown: "00:00:00", nextAt: "--:--" };
  }

  const now = new Date();

  let next = safeTimes
    .map(({ hour, minute }) => {
      const candidate = new Date(now);
      candidate.setHours(hour, minute, 0, 0);
      return candidate;
    })
    .find((candidate) => candidate.getTime() > now.getTime());

  if (!next) {
    const first = safeTimes[0];
    next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(first.hour, first.minute, 0, 0);
  }

  const diffMs = next.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    countdown: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    nextAt: `${pad(next.getHours())}:${pad(next.getMinutes())}`,
  };
}

const EventCountdown = ({ scheduleHours, colorClass }: { scheduleHours: number[]; colorClass: string }) => {
  const [state, setState] = useState<{ countdown: string; nextAt: string } | null>(null);

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
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />
      <span className="text-xs uppercase tracking-widest">
        {state === null ? (
          <span className={`font-mono font-semibold ${colorClass}`}>--:--:--</span>
        ) : (
          <>
            {"Next in "}
            <span className={`font-mono font-semibold ${colorClass}`}>{state.countdown}</span>
            {" · at "}
            <span className={`font-semibold ${colorClass}`}>{state.nextAt}</span>
          </>
        )}
      </span>
    </div>
  );
};

export default EventCountdown;
