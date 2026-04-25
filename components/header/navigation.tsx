"use client";

import type { HeaderNavItem } from "@/components/header/types";
import Logo from "@/components/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND } from "@/constants/app";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import NavigationItem from "./nav-link";

type NavigationProps = {
  items: HeaderNavItem[];
};

export default function Navigation({ items }: NavigationProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = () => setSheetOpen(false);

  return (
    <nav className="bg-background/80 border-border border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="gold-gradient-text font-serif text-xl font-bold">
            {BRAND}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <NavigationItem
              key={"href" in item ? item.href : item.label}
              item={item}
            />
          ))}
        </div>

        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <SheetHeader>
                <SheetTitle className="text-left font-serif">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-6">
                {items.map((item) => (
                  <NavigationItem
                    key={"href" in item ? item.href : item.label}
                    item={item}
                    onNavigate={closeSheet}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
