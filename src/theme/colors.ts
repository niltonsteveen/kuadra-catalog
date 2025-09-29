export const PRIMARY_TONES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;
export type PrimaryTone = typeof PRIMARY_TONES[number];
export type PrimaryPalette = Record<PrimaryTone, string>;

export const DEFAULT_PRIMARY_PALETTE: PrimaryPalette = {
  "50": "#f3f0ff",
  "100": "#dad2ff",
  "200": "#c8bcff",
  "300": "#af9dff",
  "400": "#9f8aff",
  "500": "#876dff",
  "600": "#7b63e8",
  "700": "#604ab5",
  "800": "#4a3c8c",
  "900": "#392e6b",
};

export const PRIMARY_PALETTE_STORAGE_KEY = "primaryPalette";
export const PRIMARY_COLOR_STORAGE_KEY = "primaryColor";
export const PRIMARY_PALETTE_EVENT = "kuadra:primary-palette-change";

export const PRIMARY_BG_CLASS_MAP: Record<PrimaryTone, string> = {
  "50": "bg-primary-50",
  "100": "bg-primary-100",
  "200": "bg-primary-200",
  "300": "bg-primary-300",
  "400": "bg-primary-400",
  "500": "bg-primary-500",
  "600": "bg-primary-600",
  "700": "bg-primary-700",
  "800": "bg-primary-800",
  "900": "bg-primary-900",
};

export const PRIMARY_TEXT_CLASS_MAP: Record<PrimaryTone, string> = {
  "50": "text-primary-50",
  "100": "text-primary-100",
  "200": "text-primary-200",
  "300": "text-primary-300",
  "400": "text-primary-400",
  "500": "text-primary-500",
  "600": "text-primary-600",
  "700": "text-primary-700",
  "800": "text-primary-800",
  "900": "text-primary-900",
};

export const PRIMARY_BORDER_CLASS_MAP: Record<PrimaryTone, string> = {
  "50": "border-primary-50",
  "100": "border-primary-100",
  "200": "border-primary-200",
  "300": "border-primary-300",
  "400": "border-primary-400",
  "500": "border-primary-500",
  "600": "border-primary-600",
  "700": "border-primary-700",
  "800": "border-primary-800",
  "900": "border-primary-900",
};

export const PRIMARY_RING_CLASS_MAP: Record<PrimaryTone, string> = {
  "50": "ring-primary-50",
  "100": "ring-primary-100",
  "200": "ring-primary-200",
  "300": "ring-primary-300",
  "400": "ring-primary-400",
  "500": "ring-primary-500",
  "600": "ring-primary-600",
  "700": "ring-primary-700",
  "800": "ring-primary-800",
  "900": "ring-primary-900",
};

const PREFIX = "primary-";

export function normalizePrimaryPalette(
  input?: Partial<Record<string, string>> | string | null,
  fallback: PrimaryPalette = DEFAULT_PRIMARY_PALETTE,
): PrimaryPalette {
  const palette: PrimaryPalette = { ...fallback };

  if (!input) {
    return palette;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed) {
      palette["500"] = trimmed;
    }
    return palette;
  }

  for (const tone of PRIMARY_TONES) {
    const direct = input[tone];
    const prefixed = input[`${PREFIX}${tone}`];
    const value = typeof direct === "string" ? direct : typeof prefixed === "string" ? prefixed : undefined;
    if (value && value.trim().length > 0) {
      palette[tone] = value.trim();
    }
  }

  return palette;
}