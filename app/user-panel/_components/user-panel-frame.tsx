"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UserPanelNav } from "./user-panel-nav";

export function UserPanelFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSectionList =
    pathname === "/user-panel" && searchParams.get("view") !== "character";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <aside
        className={cn(
          "md:col-span-3",
          isSectionList ? "block" : "hidden md:block",
        )}
      >
        <div className="sticky top-6">
          <UserPanelNav />
        </div>
      </aside>

      <main className="min-w-0 md:col-span-9">
        {isSectionList ? null : (
          <Link
            href="/user-panel"
            className="text-muted-foreground mb-4 inline-flex items-center gap-1 text-sm md:hidden"
          >
            <ChevronLeft className="size-icon-sm" aria-hidden="true" />
            Back
          </Link>
        )}
        <div className={cn(isSectionList && "hidden md:block")}>{children}</div>
      </main>
    </div>
  );
}
