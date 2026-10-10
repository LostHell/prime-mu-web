"use client";

import AccountActions from "@/components/header/account-actions";
import AccountAvatar from "@/components/header/account-avatar";
import BrandLockup from "@/components/header/brand-lockup";
import type { HeaderNavItem } from "@/components/header/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, XIcon } from "lucide-react";
import { useState } from "react";
import NavigationItem from "./nav-link";

type NavigationProps = {
  navItems: readonly HeaderNavItem[];
  accountItems: readonly HeaderNavItem[];
};

const itemKey = (item: HeaderNavItem) => item.href;

export default function Navigation({
  navItems,
  accountItems,
}: NavigationProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const menuItems = [...navItems, ...accountItems];
  const avatarItem = accountItems.find((item) => item.variant === "avatar");

  return (
    <nav className="bg-background/80 border-border border-b backdrop-blur-md">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center px-4 py-3 md:grid-cols-3">
        <BrandLockup />

        <div className="hidden items-center justify-center gap-5 md:flex">
          {navItems.map((item) => (
            <NavigationItem key={itemKey(item)} item={item} />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden md:block">
            <AccountActions items={accountItems} />
          </div>

          {avatarItem ? (
            <div className="md:hidden">
              <AccountAvatar
                href={avatarItem.href}
                label={avatarItem.label}
                initial={avatarItem.initial}
              />
            </div>
          ) : null}

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
                  className="-mr-2 size-8"
                  aria-label="Open menu"
                >
                  <Menu />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="border-border flex-row items-center justify-between border-b">
                  <DrawerTitle>Menu</DrawerTitle>
                  <DrawerClose>
                    <span className="sr-only">Close</span>
                    <XIcon className="size-icon-lg" aria-hidden="true" />
                  </DrawerClose>
                </DrawerHeader>
                <div className="flex flex-col">
                  {menuItems.map((item) => (
                    <NavigationItem
                      key={itemKey(item)}
                      item={item}
                      className="border-border flex w-full items-center border-b px-4 py-3"
                      onNavigate={closeDrawer}
                    />
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}
