"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRIMARY_BG_CLASS_MAP,
  PRIMARY_PALETTE_EVENT,
  PRIMARY_PALETTE_STORAGE_KEY,
  PRIMARY_TEXT_CLASS_MAP,
  PRIMARY_TONES,
  PrimaryPalette,
  normalizePrimaryPalette,
} from "@/theme/colors";

type PrimaryColorRampProps = {
  initial: PrimaryPalette;
};

export function PrimaryColorRamp({ initial }: PrimaryColorRampProps) {
  const fallbackRef = useRef<PrimaryPalette>(initial);
  const [palette, setPalette] = useState<PrimaryPalette>(initial);

  useEffect(() => {
    fallbackRef.current = initial;
    setPalette(initial);
  }, [initial]);

  useEffect(() => {
    const readFromCss = () => {
      try {
        const computed = getComputedStyle(document.documentElement);
        const next: PrimaryPalette = { ...fallbackRef.current };
        for (const tone of PRIMARY_TONES) {
          const value = computed.getPropertyValue(`--kuadra-color-primary-${tone}`).trim();
          if (value) {
            next[tone] = value;
          }
        }
        setPalette(next);
      } catch {}
    };

    const handleCustom = (event: Event) => {
      const detail = (event as CustomEvent<Partial<Record<string, string>>>).detail;
      if (detail) {
        const normalized = normalizePrimaryPalette(detail as Partial<Record<string, string>>, fallbackRef.current);
        setPalette(normalized);
        fallbackRef.current = normalized;
      } else {
        readFromCss();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== PRIMARY_PALETTE_STORAGE_KEY) {
        return;
      }
      readFromCss();
    };

    readFromCss();
    window.addEventListener(PRIMARY_PALETTE_EVENT, handleCustom as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PRIMARY_PALETTE_EVENT, handleCustom as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div className="space-y-2">
      {PRIMARY_TONES.map((tone) => (
        <div key={tone} className="flex items-center gap-4 rounded-md border px-3 py-2 bg-white/70 dark:bg-neutral-900/40">
          <div className={`h-10 w-10 rounded-md border ${PRIMARY_BG_CLASS_MAP[tone]}`} />
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wide">primary-{tone}</div>
            <div className="font-mono text-[11px] text-gray-600 dark:text-gray-300 break-all">{palette[tone]}</div>
          </div>
          <div className={`text-sm font-semibold ${PRIMARY_TEXT_CLASS_MAP[tone]}`}>
            Aa
          </div>
        </div>
      ))}
    </div>
  );
}