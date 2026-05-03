"use client";

import { getItemIconPath } from "@/lib/game/item-icon";
import { cn } from "@/lib/utils";
import * as React from "react";

export type ItemIconProps = {
  group: number;
  index: number;
  level?: number;
  alt?: string;
  className?: string;
  imageClassName?: string;
};

export function ItemIcon({
  group,
  index,
  level,
  alt = "",
  className,
  imageClassName,
}: ItemIconProps) {
  const [failed, setFailed] = React.useState(false);
  const src = getItemIconPath(group, index, { level });

  if (failed) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-xs" aria-hidden>
          -
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        className={cn(
          "max-h-full max-w-full object-contain object-center select-none",
          imageClassName,
        )}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
