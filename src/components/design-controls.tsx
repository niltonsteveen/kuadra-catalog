"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "light" | "dark" | "auto";
type StyleKind = "moderno" | "clasico";

export function DesignControls(props: {
  initial: {
    primaryColor?: string;
    style?: string;
    mode?: string;
    typography?: { sans?: string; heading?: string };
    tokens?: { radius?: string };
  };
}) {
  const { initial } = props;
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor || "oklch(0.65 0.20 300)");
  const [style, setStyle] = useState<StyleKind>((initial.style === "clasico" ? "clasico" : "moderno"));
  const toMode = (val: unknown): Mode => (val === "light" || val === "dark" || val === "auto" ? (val as Mode) : "auto");
  const [mode, setMode] = useState<Mode>(toMode(initial.mode));

  const radius = useMemo(() => (style === "clasico" ? "0px" : (initial.tokens?.radius || "0.75rem")), [style, initial.tokens?.radius]);
  const typography = useMemo(() => (
    style === "clasico"
      ? { sans: "IBM Plex Mono", heading: "IBM Plex Mono" }
      : { sans: "Manrope", heading: "Manrope" }
  ), [style]);

  // Aplicar cambios globales inmediatos y persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("primaryColor", primaryColor);
      document.documentElement.style.setProperty("--kuadra-color-primary-500", primaryColor);
    } catch {}
  }, [primaryColor]);

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
        const body = document.body; if(!body) return;
        const root = document.documentElement;
        body.classList.remove("font-sans", "font-mono");
        body.classList.add(style === "clasico" ? "font-mono" : "font-sans");
        root.classList.remove('modern','classic');
        root.classList.add(style === 'clasico' ? 'classic' : 'modern');
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
      const H=new Date().getHours();
      const isNight=(H<7||H>=19);
      const eff = mode==='dark'?'dark':mode==='light'?'light':(isNight?'dark':'light');
      const root=document.documentElement;
      if (eff === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } catch {}
  }, [mode]);

  return (
    <section className="space-y-6">
      <div className="rounded-md border p-6 space-y-4">
        <h2 className="text-xl font-medium">Editar tokens (mock overrides)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <label className="flex items-center gap-3">
            <span className="w-32 text-gray-600">Primary color</span>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 rounded-md border px-2 py-1 bg-white dark:bg-neutral-900"
              placeholder="e.g. oklch(0.65 0.20 300)"
            />
            <input
              type="color"
              value={toHexOrDefault(primaryColor)}
              onChange={(e) => setPrimaryColor(e.target.value)}
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
              <option value="moderno">moderno (Manrope, bordes redondeados)</option>
              <option value="clasico">clasico (IBM Plex Mono, sin bordes)</option>
            </select>
          </label>

          <fieldset className="col-span-1 md:col-span-2">
            <legend className="text-gray-600 mb-2">Modo</legend>
            <div className="flex items-center gap-6">
              {(["light","dark","auto"] as Mode[]).map((m) => (
                <label key={m} className="flex items-center gap-2">
                  <input type="radio" name="mode" value={m} checked={mode===m} onChange={() => setMode(m)} />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Panel de tokens activos */}
      <section className="rounded-md border p-6 space-y-4">
        <h2 className="text-xl font-medium">Tokens activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div
              aria-label="Color primario"
              className="h-6 w-6 rounded-md border"
              style={{ background: primaryColor }}
            />
            <div>
              <div className="text-gray-500">primaryColor</div>
              <div className="font-mono text-xs break-all">{primaryColor}</div>
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
            <div className="font-mono text-xs">sans: {typography.sans} · heading: {typography.heading}</div>
          </div>
          <div>
            <div className="text-gray-500">radius</div>
            <div className="font-mono text-xs">{radius}</div>
          </div>
        </div>
        <div className="rounded-md border border-dashed p-3 text-xs text-gray-600">
          Nota: shadcn/ui instalado, componentes pendientes
        </div>
      </section>

      {/* Secciones vacías */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Foundations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border p-4 min-h-28">Color</div>
          <div className="rounded-md border p-4 min-h-28">Tipografía</div>
          <div className="rounded-md border p-4 min-h-28">Espaciado</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">UI Primitives</h2>
        <div className="rounded-md border p-6 min-h-28">Tarjetas vacías para primitives</div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Composites</h2>
        <div className="rounded-md border p-6 min-h-28">Tarjetas vacías para composites</div>
      </section>
    </section>
  );
}

function toHexOrDefault(input: string): string {
  // Try to parse color strings; fall back to a default hex if invalid
  const el = document.createElement('div');
  el.style.color = '';
  el.style.color = input;
  // If the browser accepts it, computed style will set a valid color; but we can't read it easily here.
  // For simplicity, only pass-through if it starts with '#', else default to a violet hex.
  return input.startsWith('#') ? input : '#7c3aed';
}
