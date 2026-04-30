"use client";

import type { HeaderNavItem } from "@/components/header/types";
import Logo from "@/components/logo";
import { BRAND } from "@/constants/app";
import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import NavigationItem from "./nav-link";

type NavigationProps = {
  items: HeaderNavItem[];
};

export default function Navigation({ items }: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

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
          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            direction="right"
          >
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex-row items-center justify-between">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerClose>
                  <span className="sr-only">Close</span>
                  <XIcon className="size-6" aria-hidden="true" />
                </DrawerClose>
              </DrawerHeader>
              <div className="flex flex-col gap-4 p-6">
                {items.map((item) => (
                  <NavigationItem
                    key={"href" in item ? item.href : item.label}
                    item={item}
                    onNavigate={closeDrawer}
                  />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
