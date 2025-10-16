"use client";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { IconButton } from "../ui/icon-button";

export type TopBarMenuProps = {
  items: Array<{ id: string; label: string; href?: string }>;
  activeId?: string;
  onSelect?: (id: string) => void;
  showHome?: boolean;
  className?: string;
};

function useResizeObserver<T extends HTMLElement>(cb: () => void) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => cb());
    ro.observe(el);
    return () => ro.disconnect();
  }, [cb]);
  return ref;
}

export default function TopBarMenu({
  items,
  activeId,
  onSelect,
  showHome = true,
  className,
}: TopBarMenuProps) {
  const fullItems = useMemo(() => {
    const base = showHome ? [{ id: "home", label: "Inicio", href: "/" }] : [];
    const merged = [...base, ...items];
    // Deduplicate by id, keep first occurrence (ensures single 'home')
    const unique = merged.filter(
      (it, idx, arr) => arr.findIndex((x) => x.id === it.id) === idx
    );
    return unique;
  }, [items, showHome]);

  const containerRef = useResizeObserver<HTMLDivElement>(() => compute());
  const moreRef = useRef<HTMLButtonElement | null>(null);
  // hidden measuring row (not affected by visibleCount)
  const measureRowRef = useRef<HTMLDivElement | null>(null);
  const measureMoreRef = useRef<HTMLButtonElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(fullItems.length);

  const compute = () => {
    const container = containerRef.current;
    const measureRow = measureRowRef.current;
    if (!container || !measureRow) return;
    const buttons = Array.from(
      measureRow.querySelectorAll<HTMLButtonElement>("[data-measure-item]")
    );
    if (buttons.length === 0) return setVisibleCount(fullItems.length);
    const avail = container.clientWidth;
    const moreW = (measureMoreRef.current?.offsetWidth ?? 40) + 8; // include gap
    let used = 0;
    let count = 0;
    for (let i = 0; i < buttons.length; i++) {
      const w = buttons[i].offsetWidth + 8; // include gap
      const needMore = i < buttons.length - 1; // still items after this one
      const limit = needMore ? avail - moreW : avail;
      if (used + w <= limit) {
        used += w;
        count++;
      } else {
        break;
      }
    }
    setVisibleCount(count);
  };

  useEffect(() => {
    compute();
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, showHome]);

  const visibleItems = fullItems.slice(0, visibleCount);
  const overflowItems = fullItems.slice(visibleCount);

  return (
    <div
      ref={containerRef}
      role="menubar"
      className={cn(
        "inline-flex w-full justify-center min-w-0 px-16",
        className
      )}
      data-testid="topbar-menu"
    >
      {visibleItems.map((it) => (
        <button
          key={it.id}
          data-topbar-item
          role="menuitem"
          aria-current={activeId === it.id ? "page" : undefined}
          onClick={() => onSelect?.(it.id)}
          className={cn(
            " typo-xs text-black dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-black hover:text-white active:bg-black active:text-white dark:active:bg-gray-900 dark:active:text-gray-50 transition-colors p-s w-fit whitespace-nowrap",
            activeId === it.id &&
              "bg-gray-900 text-white font-bold dark:bg-black dark:text-gray-50"
          )}
          data-testid={`topbar-menu:item-${it.id}`}
        >
          {it.label}
        </button>
      ))}
      {overflowItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              ref={moreRef}
              data-testid="topbar-menu:more"
              aria-haspopup="menu"
              variant="secondary"
              className="ml-m"
            >
              <ChevronDown />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflowItems.map((i) => (
              <DropdownMenuItem
                key={i.id}
                asChild
                data-testid={`topbar-menu:more-item-${i.id}`}
              >
                <a href={i.href ?? "#"} onClick={() => onSelect?.(i.id)}>
                  {i.label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* Measuring row (invisible) to compute widths without affecting layout */}
      <div className="invisible absolute -z-50 left-0 top-0 whitespace-nowrap pointer-events-none">
        <div ref={measureRowRef} className="inline-flex justify-center">
          {fullItems.map((it) => (
            <button
              key={`measure-${it.id}`}
              data-measure-item
              className="typo-xs text-black dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-black hover:text-white active:bg-black active:text-white dark:active:bg-gray-900 dark:active:text-gray-50 transition-colors p-s w-fit whitespace-nowrap"
            >
              {it.label}
            </button>
          ))}
          <IconButton ref={measureMoreRef} variant="secondary" className="ml-m">
            <ChevronDown />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
