"use client";
import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ModernSizeOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type ModernSizeSelectorProps = {
  options: ModernSizeOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  ariaLabel?: string;
  className?: string;
  readOnly?: boolean;
};

const BASE_PILL = "p-xs typo-xxs";

export default function ModernSizeSelector({
  options,
  value,
  defaultValue,
  onChange,
  name,
  ariaLabel,
  className,
  readOnly = false,
}: ModernSizeSelectorProps) {
  const generatedName = useId();
  const groupName = name ?? `modern-size-${generatedName}`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue
  );
  const selected = isControlled ? value : internalValue;

  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndexes = useMemo(
    () => options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0),
    [options]
  );

  const firstEnabledIndex = enabledIndexes[0] ?? -1;
  const selectedIndex = options.findIndex((o) => o.id === selected);
  const activeIndex =
    selectedIndex >= 0 && !options[selectedIndex]?.disabled
      ? selectedIndex
      : firstEnabledIndex;

  const commitChange = useCallback(
    (id: string) => {
      if (readOnly) return;
      if (options.find((o) => o.id === id)?.disabled) return;
      if (!isControlled) setInternalValue(id);
      onChange?.(id);
    },
    [isControlled, onChange, options, readOnly]
  );

  const focusByIndex = (idx: number) => {
    const el = itemsRef.current[idx];
    if (el) el.focus();
  };

  const getNextIndex = (from: number, dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return -1;
    let pos = from;
    do {
      pos = (pos + dir + options.length) % options.length;
      if (!options[pos]?.disabled) return pos;
    } while (pos !== from);
    return from;
  };

  const optionClass = (selected: boolean, disabled: boolean) => {
    if (disabled) return cn("bg-gray-100 text-gray-500 cursor-not-allowed");
    if (selected) {
      return "bg-gray-900 text-white";
    }
    return "bg-gray-50 text-black hover:bg-gray-300 active:bg-gray-900 active:text-white";
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex flex-wrap gap-xs", className)}
      data-testid="modern-size-selector"
    >
      {name ? (
        <input type="hidden" name={groupName} value={selected ?? ""} />
      ) : null}
      {options.map((opt, i) => {
        const isSelected = opt.id === selected;
        const isDisabled = !!opt.disabled || readOnly;
        const tabIndex = i === activeIndex ? 0 : -1;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            tabIndex={tabIndex}
            data-testid={`modern-size-option-${opt.id}`}
            className={cn(
              "inline-flex select-none items-center justify-center modern:rounded-radius-s classic:rounded-none transition-colors outline-none ",
              BASE_PILL,
              optionClass(isSelected, isDisabled)
            )}
            onClick={() => {
              if (isDisabled) return;
              commitChange(opt.id);
            }}
            onKeyDown={(e) => {
              if (isDisabled) return;
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                commitChange(opt.id);
                return;
              }
              if (["ArrowRight", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                const next = getNextIndex(i, 1);
                if (next >= 0) {
                  focusByIndex(next);
                  commitChange(options[next]!.id);
                }
              } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
                e.preventDefault();
                const prev = getNextIndex(i, -1);
                if (prev >= 0) {
                  focusByIndex(prev);
                  commitChange(options[prev]!.id);
                }
              }
            }}
          >
            <span className="min-w-[23px] text-center">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
