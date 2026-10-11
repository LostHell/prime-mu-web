"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChartColumn,
  ChevronRight,
  Coins,
  FileText,
  ScrollText,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

const items: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "glance", label: "At a glance", icon: Users },
  { id: "server", label: "Server", icon: FileText },
  { id: "resets", label: "Resets", icon: ChartColumn },
  { id: "character", label: "Character", icon: ScrollText },
  { id: "economy", label: "Economy", icon: Coins },
  { id: "events", label: "Events", icon: Swords },
];

const ServerGuideNav = () => {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = event.currentTarget.hash.slice(1);
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    setActive(id);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    history.pushState(null, "", `#${id}`);
  };

  return (
    <Card className="overflow-hidden lg:sticky lg:top-6 lg:self-start">
      <CardContent className="px-0">
        <p className="text-muted-foreground px-4 text-xs font-semibold tracking-widest uppercase">
          Server guide
        </p>
        <ul className="mt-3 flex flex-col">
          {items.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  onClick={scrollToSection}
                  className={cn(
                    "flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm transition-colors",
                    current
                      ? "border-gold bg-gold/10 text-gold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border-transparent",
                  )}
                >
                  <item.icon
                    className="size-icon-sm shrink-0"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">{item.label}</span>
                  {current ? (
                    <ChevronRight
                      className="size-icon-sm shrink-0"
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServerGuideNav;
