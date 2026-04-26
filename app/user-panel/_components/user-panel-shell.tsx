"use client";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import * as React from "react";
import { UserPanelNav } from "./user-panel-nav";

interface UserPanelShellProps {
  children: React.ReactNode;
}

export function UserPanelShell({ children }: UserPanelShellProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <PageLayout
        as="div"
        variant="panel"
        className="bg-card/80 border-border relative border-x backdrop-blur-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          <aside className="hidden md:col-span-4 md:block">
            <div className="sticky top-6">
              <UserPanelNav />
            </div>
          </aside>

          <main className="min-w-0 md:col-span-8">{children}</main>
        </div>
      </PageLayout>

      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent className="p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle className="sr-only">User panel navigation</DrawerTitle>
          </DrawerHeader>

          <UserPanelNav
            className="border-r-0"
            onNavigate={() => setOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={cn(
          "fixed right-6 bottom-6 z-50 rounded-full shadow-lg md:hidden",
          "transition-transform duration-300 ease-out will-change-transform",
          open
            ? "pointer-events-none translate-x-24 translate-y-24"
            : "translate-x-0 translate-y-0",
        )}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu aria-hidden="true" data-icon="inline-start" />
      </Button>
    </>
  );
}
