"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { createPortal } from "react-dom";

type TooltipProviderProps = {
  children: React.ReactNode;
  delayDuration?: number;
};

type TooltipRootProps = {
  children: React.ReactNode;
  delayDuration?: number;
};

type TooltipTriggerProps = {
  asChild?: boolean;
  children: React.ReactElement;
} & React.HTMLAttributes<HTMLElement>;

type TooltipContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

type ProviderValue = {
  delayDuration: number;
};

const TooltipProviderContext = React.createContext<ProviderValue | null>(null);

function TooltipProvider({
  children,
  delayDuration = 0,
}: TooltipProviderProps) {
  const value = React.useMemo(() => ({ delayDuration }), [delayDuration]);

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

type RootValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  delayDuration: number;
};

const TooltipRootContext = React.createContext<RootValue | null>(null);

function useRoot() {
  const ctx = React.useContext(TooltipRootContext);
  if (!ctx) throw new Error("Tooltip components must be used within <Tooltip />");
  return ctx;
}

function chainHandlers<E>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event);
    ours(event);
  };
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(value);
      else (ref as React.MutableRefObject<T>).current = value;
    }
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function computeAutoPosition(triggerRect: DOMRect, contentRect: DOMRect) {
  const padding = 8;
  const offset = 10;

  const available = {
    top: triggerRect.top - padding,
    bottom: window.innerHeight - triggerRect.bottom - padding,
  };

  const fits = {
    top: available.top >= contentRect.height + offset,
    bottom: available.bottom >= contentRect.height + offset,
  };

  // Only allow top/bottom. Prefer top when it fits, otherwise bottom.
  // (If neither fits, choose the side with more available space.)
  const side =
    (fits.top ? "top" : fits.bottom ? "bottom" : available.top >= available.bottom ? "top" : "bottom");

  let top = 0;
  let left = 0;

  const centerX = triggerRect.left + triggerRect.width / 2;

  if (side === "top") {
    top = triggerRect.top - contentRect.height - offset;
    left = centerX - contentRect.width / 2;
  } else if (side === "bottom") {
    top = triggerRect.bottom + offset;
    left = centerX - contentRect.width / 2;
  }

  const maxLeft = window.innerWidth - contentRect.width - padding;
  const maxTop = window.innerHeight - contentRect.height - padding;

  return {
    top: clamp(top, padding, Math.max(padding, maxTop)),
    left: clamp(left, padding, Math.max(padding, maxLeft)),
  };
}

function Tooltip({
  children,
  delayDuration,
}: TooltipRootProps) {
  const provider = React.useContext(TooltipProviderContext);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = React.useState(false);

  const effectiveDelay = delayDuration ?? provider?.delayDuration ?? 0;

  const value = React.useMemo<RootValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      delayDuration: effectiveDelay,
    }),
    [open, effectiveDelay],
  );

  return (
    <TooltipRootContext.Provider value={value}>
      {children}
    </TooltipRootContext.Provider>
  );
}

function TooltipTrigger({
  asChild,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps) {
  const ctx = useRoot();

  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  React.useEffect(() => clearTimers, []);

  const scheduleOpen = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => ctx.setOpen(true), ctx.delayDuration);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => ctx.setOpen(false), 30);
  };

  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  const childProps = child.props as Record<string, unknown>;

  return React.cloneElement<any>(
    child,
    {
      ...(asChild ? childProps : null),
      ...props,
      ref: mergeRefs((child as any).ref, (node: HTMLElement | null) => {
        ctx.triggerRef.current = node;
      }),
      "data-slot": "tooltip-trigger",
      onMouseEnter: chainHandlers(onMouseEnter, () => scheduleOpen()),
      onMouseLeave: chainHandlers(onMouseLeave, () => scheduleClose()),
      onFocus: chainHandlers(onFocus, () => ctx.setOpen(true)),
      onBlur: chainHandlers(onBlur, () => scheduleClose()),
    },
  );
}

function TooltipContent({
  children,
  className,
  style,
  ...props
}: TooltipContentProps) {
  const ctx = useRoot();
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(
    null,
  );

  const updatePosition = React.useCallback(() => {
    const trigger = ctx.triggerRef.current;
    const content = ctx.contentRef.current;
    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    setPos(computeAutoPosition(triggerRect, contentRect));
  }, [ctx]);

  React.useEffect(() => {
    if (!ctx.open) return;
    const trigger = ctx.triggerRef.current;
    if (!trigger) return;

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        updatePosition();
      });
    };

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => schedule())
        : null;
    ro?.observe(trigger);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry) return;

              // If the trigger is no longer visible, hide the tooltip.
              if (entry.intersectionRatio === 0) {
                ctx.setOpen(false);
                return;
              }

              // If it is visible, ResizeObserver will keep placement accurate
              // for layout changes (but we intentionally do NOT reposition on scroll).
            },
            {
              root: null,
              threshold: [0, 1],
            },
          )
        : null;
    io?.observe(trigger);

    // On scroll, just hide. Do not reposition.
    const onScroll = () => {
      console.log("scroll");
      ctx.setOpen(false)
    };
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true } as any);
      if (raf) window.cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [ctx.open, updatePosition]);

  React.useLayoutEffect(() => {
    if (ctx.open) updatePosition();
  }, [ctx.open, updatePosition]);

  if (!ctx.open) return null;

  const node = (
    <div
      {...props}
      ref={(el) => {
        ctx.contentRef.current = el;
      }}
      data-slot="tooltip-content"
      style={{
        position: "fixed",
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        zIndex: 50,
        ...style,
      }}
      className={cn(
        "pointer-events-none rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-sm outline-hidden",
        className,
      )}
    >
      {children}
    </div>
  );

  return createPortal(node, document.body);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

