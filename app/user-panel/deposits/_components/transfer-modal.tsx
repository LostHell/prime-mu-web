"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { type ReactNode } from "react";

export type TransferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isPending: boolean;
  children: ReactNode;
};

export function TransferModal({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  children,
}: TransferModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-sm"
          showCloseButton={!isPending}
          onPointerDownOutside={(event) => {
            if (isPending) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (isPending) event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={!isPending}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
