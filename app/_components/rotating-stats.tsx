"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Stat = { label: string; value: string };

const RotatingStats = ({ groups }: { groups: Stat[][] }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (groups.length < 2) return;

    let fadeTimer: number | undefined;
    const timer = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % groups.length);
        setVisible(true);
      }, 250);
    }, 4000);

    return () => {
      window.clearInterval(timer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
    };
  }, [groups.length]);

  const stats = groups[index] ?? [];

  return (
    <dl
      aria-live="polite"
      className={cn(
        "mt-8 flex min-h-14 w-full flex-wrap items-stretch gap-x-4 gap-y-3 transition-opacity duration-300 sm:w-auto sm:flex-nowrap sm:gap-0",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {stats.map((stat, statIndex) => (
        <div
          key={stat.label}
          className="flex flex-[1_0_auto] items-stretch sm:flex-none"
        >
          {statIndex > 0 ? (
            <div className="bg-border mx-4 hidden w-px self-stretch sm:block" />
          ) : null}
          <div>
            <dd className="font-serif text-2xl font-bold whitespace-nowrap md:text-3xl">
              {stat.value}
            </dd>
            <dt className="text-muted-foreground text-xs tracking-widest whitespace-nowrap uppercase">
              {stat.label}
            </dt>
          </div>
        </div>
      ))}
    </dl>
  );
};

export default RotatingStats;
