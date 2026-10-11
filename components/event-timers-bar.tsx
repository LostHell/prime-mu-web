"use client";

import { eventSchedules } from "@/constants/events";
import { SERVER_TIME_ZONE } from "@/constants/server";
import { cn } from "@/lib/utils";
import { formatCountdown, nextEventTime } from "@/lib/utils/event-schedule";
import { useEffect, useState } from "react";

const events = [
  {
    name: "Blood Castle",
    hours: eventSchedules.bloodCastle,
    colorClass: "text-crimson",
  },
  {
    name: "Devil Square",
    hours: eventSchedules.devilSquare,
    colorClass: "text-gold",
  },
] as const;

const EventTimersBar = () => {
  const [deadlines, setDeadlines] = useState<Record<string, number | null>>({});
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const nextAt = new Map<string, number | null>();
    const tick = () => {
      const current = Date.now();
      let changed = false;
      for (const event of events) {
        const due = nextAt.get(event.name);
        if (due == null || due <= current) {
          nextAt.set(
            event.name,
            nextEventTime(event.hours, current, SERVER_TIME_ZONE),
          );
          changed = true;
        }
      }
      if (changed) setDeadlines(Object.fromEntries(nextAt));
      setNow(current);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-border bg-card/80 border-b">
      <ul className="mx-auto flex max-w-5xl items-center gap-x-6 gap-y-1 px-4 py-1.5 text-sm">
        {events.map((event) => {
          const deadline = deadlines[event.name];
          const countdown =
            now === null || deadline == null
              ? "—"
              : formatCountdown(deadline - now);

          return (
            <li key={event.name} className="flex shrink-0 items-baseline gap-2">
              <span className="text-muted-foreground">{event.name}</span>
              <span
                className={cn(
                  "inline-block w-[6ch] shrink-0 text-right font-semibold whitespace-nowrap tabular-nums",
                  event.colorClass,
                )}
              >
                {countdown}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EventTimersBar;
