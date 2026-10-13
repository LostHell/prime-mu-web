import RotatingStats from "@/app/_components/rotating-stats";
import ServerStatus from "@/components/server-status";
import { Button } from "@/components/ui/button";
import { CLIENT_FPS } from "@/constants/app";
import {
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
} from "@/constants/resets";
import {
  DROP_RATE,
  EXPERIENCE_RATE,
  MAX_LEVEL,
  VERSION,
} from "@/constants/server";
import { getServerInfo } from "@/lib/queries/get-server-info";
import { cn } from "@/lib/utils";
import { formatCompact, formatNumber } from "@/lib/utils/numbers";
import { Download } from "lucide-react";
import Link from "next/link";

const statGroups = [
  [
    { label: "Exp", value: EXPERIENCE_RATE },
    { label: "Drop", value: DROP_RATE },
    { label: "Max res", value: formatCompact(MAX_RESETS) },
    { label: "Max level", value: formatCompact(MAX_LEVEL) },
  ],
  [
    { label: "Reset level", value: formatCompact(MIN_RESET_LEVEL) },
    { label: "Pts per reset", value: formatCompact(POINTS_PER_RESET) },
  ],
];

const HomeHero = async () => {
  const serverInfo = await getServerInfo();
  const population = [
    {
      label: "Players online",
      value: formatNumber(serverInfo.online),
      live: serverInfo.status === "online",
    },
    { label: "Max online", value: formatNumber(serverInfo.maxOnline) },
    {
      label: "Registered accounts",
      value: formatNumber(serverInfo.registered),
    },
    { label: "Active guilds", value: formatNumber(serverInfo.guilds) },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-left md:left-auto md:w-[68%] md:bg-left"
        style={{ backgroundImage: "url(/hero-banner.jpg)" }}
      />
      <div
        aria-hidden="true"
        className="from-background via-background/75 pointer-events-none absolute inset-0 bg-linear-to-r via-55% to-transparent md:via-40%"
      />
      <div
        aria-hidden="true"
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-6 pb-8 md:pt-10 md:pb-10">
        <div className="max-w-xl">
          <p className="text-gold mb-4 text-xs font-semibold tracking-widest uppercase">
            Classic MU Online · {VERSION}
          </p>
          <h1 className="font-serif text-4xl leading-tight font-bold md:text-6xl">
            <span className="text-foreground block">Your next reset.</span>
            <span className="gold-gradient-text block">
              Your old obsession.
            </span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-md text-base md:text-lg">
            Classic combat. Four classes. High performance gaming experience
            with <strong>{CLIENT_FPS}+</strong> FPS.
          </p>

          <RotatingStats groups={statGroups} />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" decorative asChild>
              <Link href="/downloads">
                <Download aria-hidden="true" />
                Download client
              </Link>
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              decorative
              asChild
            >
              <Link href="/register">Create account</Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-3">Windows · MacOS</p>
          <ServerStatus
            className="mt-5 mb-0 justify-start"
            status={serverInfo.status}
          />
        </div>

        <dl className="border-border bg-card/80 mt-10 grid grid-cols-2 overflow-hidden rounded-xl border md:grid-cols-4">
          {population.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "border-border px-5 py-4",
                index % 2 === 0 && "max-md:border-r",
                index < 2 && "max-md:border-b",
                index < population.length - 1 && "md:border-r",
              )}
            >
              <dd className="flex items-center gap-2 font-serif text-3xl font-bold">
                {item.live ? (
                  <span className="bg-online size-2 rounded-full" />
                ) : null}
                {item.value}
              </dd>
              <dt className="text-muted-foreground mt-1 text-xs tracking-widest uppercase">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default HomeHero;
