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
  generatePaletteFromBase,
} from "@/theme/colors";
import { PrimaryColorRamp } from "@/components/primary-color-ramp";
import { RadiusShowcase } from "@/components/radius";
import { SpacingShowcase } from "@/components/spacing";
import { TypographyShowcase } from "@/components/typography";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { StickyHeader } from "@/components/ui/sticky-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Divider } from "@/components/ui/divider";
import {
  SearchBar,
  SearchBarTrigger,
  SearchBarDriver,
  SearchBarContent,
  SearchBarResultItem,
  SearchBarResultGroup,
} from "@/components/ui/search-bar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import CounterV2 from "@/components/ui/counter";
import { Plus } from "lucide-react";
const SEMANTIC_TONES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;
const SEMANTIC_SCALE_IDS = [
  "gray",
  "info",
  "warning",
  "error",
  "success",
] as const;

type SemanticTone = (typeof SEMANTIC_TONES)[number];
type SemanticScaleId = (typeof SEMANTIC_SCALE_IDS)[number];

const SEMANTIC_LABELS: Record<SemanticScaleId, string> = {
  gray: "Gray",
  info: "Info",
  warning: "Warning",
  error: "Error",
  success: "Success",
};

const ADAPTIVE_ROUNDED =
  "modern:rounded-[var(--radius-md)] classic:rounded-none";
type SemanticPaletteState = Record<
  SemanticScaleId,
  Record<SemanticTone, string>
>;

function createEmptySemanticPalette(): SemanticPaletteState {
  return SEMANTIC_SCALE_IDS.reduce((acc, scale) => {
    acc[scale] = SEMANTIC_TONES.reduce((toneAcc, tone) => {
      toneAcc[tone] = "";
      return toneAcc;
    }, {} as Record<SemanticTone, string>);
    return acc;
  }, {} as SemanticPaletteState);
}

function hexToRgbString(color: string): string | null {
  const input = color.trim();
  if (!input) {
    return null;
  }
  if (input.startsWith("rgb")) {
    return input;
  }
  const value = input.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function readSemanticPaletteFromCss(
  computed: CSSStyleDeclaration
): SemanticPaletteState {
  const next = createEmptySemanticPalette();
  for (const scale of SEMANTIC_SCALE_IDS) {
    for (const tone of SEMANTIC_TONES) {
      const value = computed
        .getPropertyValue(`--kuadra-color-${scale}-${tone}`)
        .trim();
      if (value) {
        next[scale][tone] = value;
      }
    }
  }
  return next;
}
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
  const [semanticPalettes, setSemanticPalettes] =
    useState<SemanticPaletteState>(() => createEmptySemanticPalette());
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
      const computed = getComputedStyle(document.documentElement);
      const next = readSemanticPaletteFromCss(computed);
      setSemanticPalettes(next);
    } catch {}
  }, []);
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
    if (tone === "500") {
      // Cuando se cambia el primary-500, generar toda la paleta automáticamente
      const newPalette = generatePaletteFromBase(value);
      setPrimaryPalette(newPalette);
    } else {
      // Para otros tonos, solo actualizar ese tono específico
      setPrimaryPalette((prev) => ({ ...prev, [tone]: value }));
    }
  };
  return (
    <section className="space-y-6">
      <div className={`${ADAPTIVE_ROUNDED} border p-6 space-y-4`}>
        <h2 className="text-xl font-medium">Editar tokens (mock overrides)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <label className="flex items-center gap-3">
            <span className="w-32 text-gray-600">primary-500</span>
            <input
              type="text"
              value={primary500}
              onChange={(e) => handlePrimaryChange("500", e.target.value)}
              className={`flex-1 ${ADAPTIVE_ROUNDED} border px-2 py-1 bg-white dark:bg-neutral-900`}
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
              className={`flex-1 ${ADAPTIVE_ROUNDED} border px-2 py-1 bg-white dark:bg-neutral-900`}
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
      <section className={`${ADAPTIVE_ROUNDED} border p-6 space-y-4`}>
        <h2 className="text-xl font-medium">Tokens activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div
              aria-label="Color primario"
              className={`h-6 w-6 ${ADAPTIVE_ROUNDED} border`}
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
                  className={`${ADAPTIVE_ROUNDED} border p-2 space-y-2 bg-white/60 dark:bg-neutral-900/40`}
                >
                  <div
                    className={`h-10 w-full ${ADAPTIVE_ROUNDED} ${PRIMARY_BG_CLASS_MAP[tone]}`}
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
        <div
          className={`${ADAPTIVE_ROUNDED} border border-dashed p-3 text-xs text-gray-600`}
        >
          Nota: shadcn/ui instalado, componentes pendientes
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Escalas complementarias</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {SEMANTIC_SCALE_IDS.map((scaleId) => {
            const palette = semanticPalettes[scaleId];
            const label = SEMANTIC_LABELS[scaleId];
            return (
              <div
                key={scaleId}
                className={`${ADAPTIVE_ROUNDED} border bg-white/70 dark:bg-neutral-900/40 p-4 space-y-3`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {scaleId}
                  </span>
                </div>
                <div className="space-y-2">
                  {SEMANTIC_TONES.map((tone) => {
                    const value = palette?.[tone] ?? "";
                    const rgb = hexToRgbString(value);
                    const swatchStyle = value
                      ? { backgroundColor: value }
                      : undefined;
                    const textStyle = value ? { color: value } : undefined;
                    const utilityClass = `bg-${scaleId}-${tone}`;
                    const cssVarName = `--kuadra-color-${scaleId}-${tone}`;
                    return (
                      <div
                        key={tone}
                        className={`flex items-center gap-3 ${ADAPTIVE_ROUNDED} border border-gray-100/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-900/50 px-3 py-2`}
                      >
                        <div
                          className={`h-10 w-10 flex-shrink-0 ${ADAPTIVE_ROUNDED} border border-black/5 shadow-sm`}
                          style={swatchStyle}
                        />
                        <div className="flex-1">
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                            {scaleId}-{tone}
                          </div>
                          <div className="font-mono text-[11px] text-gray-600 dark:text-gray-300 break-all">
                            {value || cssVarName}
                          </div>
                          <div className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                            {cssVarName}
                          </div>
                          <div className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                            {utilityClass}
                          </div>
                          {rgb ? (
                            <div className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                              {rgb}
                            </div>
                          ) : null}
                        </div>
                        <div
                          className="text-sm font-semibold"
                          style={textStyle}
                        >
                          Aa
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Foundations</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className={`${ADAPTIVE_ROUNDED} border p-4 col-span-3`}>
            <TypographyShowcase styleKind={style} />
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-4 space-y-3`}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Color
            </h3>
            <PrimaryColorRamp initial={primaryPalette} />
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-4`}>
            <SpacingShowcase styleKind={style} />
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-4`}>
            <RadiusShowcase styleKind={style} />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">UI Primitives</h2>
        <div className="space-y-4">
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Default
                </h4>
                <div className="flex flex-col gap-2">
                  <Button>Default</Button>
                  <Button prefixIcon={<Plus />} suffixIcon={<Plus />}>
                    With Icons
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Destructive
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="destructive">Destructive</Button>
                  <Button
                    variant="destructive"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="destructive" disabled>
                    Destructive Disabled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Secondary
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary">Secondary</Button>
                  <Button
                    variant="secondary"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="secondary" disabled>
                    Secondary Disabled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Destructive Secondary
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="destructive_secondary">
                    Destructive Secondary
                  </Button>
                  <Button
                    variant="destructive_secondary"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="destructive_secondary" disabled>
                    Destructive Secondary Disabled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Text
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="text">Text</Button>
                  <Button
                    variant="text"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="text" disabled>
                    Text Disabled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Destructive Text
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="destructive_text">Destructive Text</Button>
                  <Button
                    variant="destructive_text"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="destructive_text" disabled>
                    Destructive Text Disabled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Link
                </h4>
                <div className="flex flex-col gap-2">
                  <Button variant="link">Link</Button>
                  <Button
                    variant="link"
                    prefixIcon={<Plus />}
                    suffixIcon={<Plus />}
                  >
                    With Icons
                  </Button>
                  <Button variant="link" disabled>
                    Link Disabled
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Medium
                </h4>
                <Button size="m">Medium Button</Button>
                <Button size="m" prefixIcon={<Plus />} suffixIcon={<Plus />}>
                  With Icons
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Small
                </h4>
                <Button size="s">Small Button</Button>
                <Button size="s" prefixIcon={<Plus />} suffixIcon={<Plus />}>
                  With Icons
                </Button>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">IconButton Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Default
                </h4>
                <div className="flex flex-col gap-2">
                  <IconButton>
                    <Plus />
                  </IconButton>
                  <IconButton disabled>
                    <Plus />
                  </IconButton>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Default Destructive
                </h4>
                <div className="flex flex-col gap-2">
                  <IconButton variant="defaultDestructive">
                    <Plus />
                  </IconButton>
                  <IconButton variant="defaultDestructive" disabled>
                    <Plus />
                  </IconButton>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Secondary
                </h4>
                <div className="flex flex-col gap-2">
                  <IconButton variant="secondary">
                    <Plus />
                  </IconButton>
                  <IconButton variant="secondary" disabled>
                    <Plus />
                  </IconButton>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Secondary Destructive
                </h4>
                <div className="flex flex-col gap-2">
                  <IconButton variant="secondaryDestructive">
                    <Plus />
                  </IconButton>
                  <IconButton variant="secondaryDestructive" disabled>
                    <Plus />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Sticky Header</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Desktop Example
                </h4>
                <div
                  className={`${ADAPTIVE_ROUNDED} border border-dashed border-primary-200 bg-white/70 dark:bg-neutral-900/40 p-4`}
                >
                  <div
                    className={`h-40 overflow-y-auto bg-white dark:bg-neutral-900`}
                  >
                    <StickyHeader text="Lorem ipsum dolor sit amet consectetur. In lacus et sit pretium sagittis eu." />
                    <div className="space-y-3 p-4 text-xs text-gray-600 dark:text-gray-400">
                      <p>
                        Contenido de ejemplo para mostrar cómo el encabezado se
                        mantiene fijo dentro de un contenedor desplazable.
                      </p>
                      <p>
                        Desplaza dentro de la tarjeta para ver el banner
                        adherido al borde superior.
                      </p>
                      <p>
                        Úsalo para mensajes globales, alertas de tenant o
                        anuncios de campañas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:max-w-sm">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mobile Example
                </h4>
                <div
                  className={`${ADAPTIVE_ROUNDED} border border-dashed border-primary-200 bg-white/70 dark:bg-neutral-900/40 p-4`}
                >
                  <div
                    className={`h-40 overflow-y-auto bg-white dark:bg-neutral-900`}
                  >
                    <StickyHeader text="Lorem ipsum dolor sit amet consectetur." />
                    <div className="space-y-3 p-4 text-xs text-gray-600 dark:text-gray-400">
                      <p>
                        El mismo componente dentro de un ancho reducido. Siempre
                        ocupa el 100% del contenedor.
                      </p>
                      <p>
                        Combínalo con wrappers responsivos para escenarios
                        mobile o layouts segmentados.
                      </p>
                      <p>
                        El color usa{" "}
                        <code className="font-mono">bg-primary-300</code> según
                        los tokens actuales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Accordion</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Lorem ipsum dolor sit amet</AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Ut enim ad minim veniam</AccordionTrigger>
                <AccordionContent>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Duis aute irure dolor</AccordionTrigger>
                <AccordionContent>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Input</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Default Input
                </h4>
                <Input placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Input with Prefix Icon
                </h4>
                <Input
                  placeholder="Search..."
                  prefixIcon={
                    <IconButton variant={"secondary"}>
                      <Plus />
                    </IconButton>
                  }
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Input with Suffix Icon
                </h4>
                <Input
                  placeholder="Enter text..."
                  suffixIcon={
                    <IconButton variant={"secondary"}>
                      <Plus />
                    </IconButton>
                  }
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Input with Both Icons
                </h4>
                <Input
                  placeholder="Search..."
                  prefixIcon={
                    <IconButton variant={"secondary"}>
                      <Plus />
                    </IconButton>
                  }
                  suffixIcon={
                    <IconButton variant={"secondary"}>
                      <Plus />
                    </IconButton>
                  }
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Disabled Input
                </h4>
                <Input placeholder="Disabled input" disabled />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Input with Value
                </h4>
                <Input value="Sample text" readOnly />
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Command</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Command Dialog
                </h4>
                <CommandDialog>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem>Calendar</CommandItem>
                      <CommandItem>Search Emoji</CommandItem>
                      <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Separator</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Horizontal Separator
                </h4>
                <div className="flex items-center space-x-4">
                  <span>Item 1</span>
                  <Separator orientation="horizontal" className="w-16" />
                  <span>Item 2</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Vertical Separator
                </h4>
                <div className="flex items-center space-x-4 h-8">
                  <span>Item 1</span>
                  <Separator orientation="vertical" />
                  <span>Item 2</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Divider</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Horizontal Dividers
                </h4>
                <div className="space-y-2">
                  <div>Content above</div>
                  <Divider size="s" />
                  <div>Content below</div>
                  <Divider size="m" />
                  <div>More content</div>
                  <Divider size="l" />
                  <div>Final content</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Vertical Dividers
                </h4>
                <div className="flex items-center space-x-4 h-16">
                  <span>Left</span>
                  <Divider orientation="vertical" size="s" />
                  <span>Center</span>
                  <Divider orientation="vertical" size="m" />
                  <span>Right</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6 bg-gray-100`}>
            <h3 className="text-lg font-semibold mb-4">SearchBar</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Open Variant
                </h4>
                <SearchBar variant="open">
                  <SearchBarTrigger asChild>
                    <SearchBarDriver />
                  </SearchBarTrigger>
                  <SearchBarContent>
                    <SearchBarResultGroup label="Recent">
                      <SearchBarResultItem>Item 1</SearchBarResultItem>
                      <SearchBarResultItem>Item 2</SearchBarResultItem>
                    </SearchBarResultGroup>
                  </SearchBarContent>
                </SearchBar>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nested Variant
                </h4>
                <SearchBar variant="nested">
                  <SearchBarTrigger asChild>
                    <SearchBarDriver placeholder="Search..." />
                  </SearchBarTrigger>
                  <SearchBarContent>
                    <SearchBarResultItem>Result 1</SearchBarResultItem>
                    <SearchBarResultItem>Result 2</SearchBarResultItem>
                  </SearchBarContent>
                </SearchBar>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Dialog</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Basic Dialog
                </h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a description of the dialog content.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Dialog content goes here.</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Popover</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Basic Popover
                </h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button>Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Popover Content</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the content inside the popover.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className={`${ADAPTIVE_ROUNDED} border p-6`}>
            <h3 className="text-lg font-semibold mb-4">Counter</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Default Counter
                </h4>
                <CounterV2 />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Counter with Initial Value
                </h4>
                <CounterV2 value={5} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Editable Counter
                </h4>
                <CounterV2 isEditable />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Counter with Remove Disabled
                </h4>
                <CounterV2 disableMinus />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Composites</h2>
        <div className={`${ADAPTIVE_ROUNDED} border p-6 min-h-28`}>
          Tarjetas vacias para composites
        </div>
      </section>
      <Footer />
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
