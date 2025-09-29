"use client";

import { useEffect, useState } from "react";
import {
  PRIMARY_BG_CLASS_MAP,
  PRIMARY_COLOR_STORAGE_KEY,
  PRIMARY_PALETTE_EVENT,
  PRIMARY_PALETTE_STORAGE_KEY,
  PRIMARY_TEXT_CLASS_MAP,
  PRIMARY_TONES,
  PrimaryPalette,
  normalizePrimaryPalette,
} from "@/theme/colors";
import { PrimaryColorRamp } from "@/components/primary-color-ramp";
import { SpacingShowcase } from "@/components/spacing";
import { TypographyShowcase } from "@/components/typography";

type Mode = "light" | "dark" | "auto";
type StyleKind = "moderno" | "clasico";

type InitialConfig = {
  primaryColor?: string;
  colors?: { primary?: Partial<Record<string, string>> };
  style?: string;
  mode?: string;
  typography?: { sans?: string; heading?: string };
  tokens?: { radius?: string };
};

export function DesignControls(props: { initial: InitialConfig }) {
  const { initial } = props;
  const [primaryPalette, setPrimaryPalette] = useState<PrimaryPalette>(() =>
    normalizePrimaryPalette(
      initial.colors?.primary ?? initial.primaryColor ?? null
    )
  );
  const primary500 = primaryPalette["500"];
  const [style, setStyle] = useState<StyleKind>(
    initial.style === "clasico" ? "clasico" : "moderno"
  );
  const toMode = (val: unknown): Mode =>
    val === "light" || val === "dark" || val === "auto"
      ? (val as Mode)
      : "auto";
  const [mode, setMode] = useState<Mode>(toMode(initial.mode));

  const radius =
    style === "clasico" ? "0px" : initial.tokens?.radius || "0.75rem";
  const typography =
    style === "clasico"
      ? { sans: "IBM Plex Mono", heading: "IBM Plex Mono" }
      : { sans: "Manrope", heading: "Manrope" };

  useEffect(() => {
    try {
      const root = document.documentElement;
      for (const tone of PRIMARY_TONES) {
        root.style.setProperty(
          `--kuadra-color-primary-${tone}`,
          primaryPalette[tone]
        );
      }
      localStorage.setItem(
        PRIMARY_PALETTE_STORAGE_KEY,
        JSON.stringify(primaryPalette)
      );
      localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, primaryPalette["500"]);
      window.dispatchEvent(
        new CustomEvent(PRIMARY_PALETTE_EVENT, { detail: primaryPalette })
      );
    } catch {}
  }, [primaryPalette]);

  useEffect(() => {
    try {
      localStorage.setItem("radius", radius);
      document.documentElement.style.setProperty("--radius-md", radius);
    } catch {}
  }, [radius]);

  useEffect(() => {
    try {
      localStorage.setItem("style", style);
      const apply = () => {
        const body = document.body;
        if (!body) return;
        const root = document.documentElement;
        body.classList.remove("font-sans", "font-mono");
        body.classList.add(style === "clasico" ? "font-mono" : "font-sans");
        root.classList.remove("modern", "classic");
        root.classList.add(style === "clasico" ? "classic" : "modern");
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", apply);
      } else {
        apply();
      }
    } catch {}
  }, [style]);

  useEffect(() => {
    try {
      localStorage.setItem("theme", mode);
      const H = new Date().getHours();
      const isNight = H < 7 || H >= 19;
      const eff =
        mode === "dark"
          ? "dark"
          : mode === "light"
          ? "light"
          : isNight
          ? "dark"
          : "light";
      const root = document.documentElement;
      if (eff === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch {}
  }, [mode]);

  const handlePrimaryChange = (
    tone: (typeof PRIMARY_TONES)[number],
    value: string
  ) => {
    setPrimaryPalette((prev) => ({ ...prev, [tone]: value }));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-md border p-6 space-y-4">
        <h2 className="text-xl font-medium">Editar tokens (mock overrides)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <label className="flex items-center gap-3">
            <span className="w-32 text-gray-600">primary-500</span>
            <input
              type="text"
              value={primary500}
              onChange={(e) => handlePrimaryChange("500", e.target.value)}
              className="flex-1 rounded-md border px-2 py-1 bg-white dark:bg-neutral-900"
              placeholder="e.g. #876dff"
            />
            <input
              type="color"
              value={toHexOrDefault(primary500)}
              onChange={(e) => handlePrimaryChange("500", e.target.value)}
              className="h-8 w-10 cursor-pointer"
              aria-label="Color picker"
            />
          </label>

          <label className="flex items-center gap-3">
            <span className="w-32 text-gray-600">Estilo</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleKind)}
              className="flex-1 rounded-md border px-2 py-1 bg-white dark:bg-neutral-900"
            >
              <option value="moderno">
                moderno (Manrope, bordes redondeados)
              </option>
              <option value="clasico">
                clasico (IBM Plex Mono, sin bordes)
              </option>
            </select>
          </label>

          <fieldset className="col-span-1 md:col-span-2">
            <legend className="text-gray-600 mb-2">Modo</legend>
            <div className="flex items-center gap-6">
              {(["light", "dark", "auto"] as Mode[]).map((m) => (
                <label key={m} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value={m}
                    checked={mode === m}
                    onChange={() => setMode(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <section className="rounded-md border p-6 space-y-4">
        <h2 className="text-xl font-medium">Tokens activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div
              aria-label="Color primario"
              className="h-6 w-6 rounded-md border"
              style={{ background: primary500 }}
            />
            <div>
              <div className="text-gray-500">primary-500</div>
              <div className="font-mono text-xs break-all">{primary500}</div>
              <div
                className={`text-xs font-semibold ${PRIMARY_TEXT_CLASS_MAP["500"]}`}
              >
                Aa
              </div>
            </div>
          </div>
          <div>
            <div className="text-gray-500">style</div>
            <div className="font-mono text-xs">{style}</div>
          </div>
          <div>
            <div className="text-gray-500">mode</div>
            <div className="font-mono text-xs">{mode}</div>
          </div>
          <div>
            <div className="text-gray-500">typography</div>
            <div className="font-mono text-xs">
              sans: {typography.sans} / heading: {typography.heading}
            </div>
          </div>
          <div>
            <div className="text-gray-500">radius</div>
            <div className="font-mono text-xs">{radius}</div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="text-gray-500">Escala primary</div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {PRIMARY_TONES.map((tone) => (
                <div
                  key={tone}
                  className="rounded-md border p-2 space-y-2 bg-white/60 dark:bg-neutral-900/40"
                >
                  <div
                    className={`h-10 w-full rounded ${PRIMARY_BG_CLASS_MAP[tone]}`}
                  />
                  <div className="text-xs font-semibold">primary-{tone}</div>
                  <div
                    className={`text-xs font-semibold ${PRIMARY_TEXT_CLASS_MAP[tone]}`}
                  >
                    Aa
                  </div>
                  <div className="font-mono text-[10px] break-all text-gray-600 dark:text-gray-300">
                    {primaryPalette[tone]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-md border border-dashed p-3 text-xs text-gray-600">
          Nota: shadcn/ui instalado, componentes pendientes
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Foundations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-md border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Color
            </h3>
            <PrimaryColorRamp initial={primaryPalette} />
          </div>
          <div className="rounded-md border p-4">
            <SpacingShowcase styleKind={style} />
          </div>
          <div className="rounded-md border p-4 col-span-2">
            <TypographyShowcase styleKind={style} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">UI Primitives</h2>
        <div className="rounded-md border p-6 min-h-28">
          Tarjetas vacias para primitives
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Composites</h2>
        <div className="rounded-md border p-6 min-h-28">
          Tarjetas vacias para composites
        </div>
      </section>
    </section>
  );
}

function toHexOrDefault(input: string): string {
  if (!input) return "#876dff";
  if (input.startsWith("#")) return input;
  const el = document.createElement("div");
  el.style.color = "";
  el.style.color = input;
  if (el.style.color.startsWith("#")) {
    return el.style.color;
  }
  return "#876dff";
}
