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

/**
 * Convierte un color hex a HSL
 */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

/**
 * Convierte HSL a hex
 */
function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Genera una paleta completa de colores a partir de un color base
 */
export function generatePaletteFromBase(baseColor: string): PrimaryPalette {
  // Normalizar el color base a hex
  let normalizedColor = baseColor.trim();
  if (!normalizedColor.startsWith('#')) {
    // Si no es hex, intentar convertir
    const el = document.createElement('div');
    el.style.color = normalizedColor;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    
    if (computed.startsWith('rgb')) {
      const matches = computed.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]);
        const g = parseInt(matches[1]);
        const b = parseInt(matches[2]);
        normalizedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
  }

  // Si aún no es un hex válido, usar el color por defecto
  if (!/^#[0-9A-F]{6}$/i.test(normalizedColor)) {
    normalizedColor = DEFAULT_PRIMARY_PALETTE["500"];
  }

  const [h, s, l] = hexToHsl(normalizedColor);

  // Definir los valores de luminosidad para cada tono
  const lightnessMappings = {
    "50": Math.min(95, l + (95 - l) * 0.9),
    "100": Math.min(90, l + (90 - l) * 0.8),
    "200": Math.min(80, l + (80 - l) * 0.6),
    "300": Math.min(70, l + (70 - l) * 0.4),
    "400": Math.min(60, l + (60 - l) * 0.2),
    "500": l, // Color base
    "600": Math.max(40, l - (l - 40) * 0.2),
    "700": Math.max(30, l - (l - 30) * 0.4),
    "800": Math.max(20, l - (l - 20) * 0.6),
    "900": Math.max(10, l - (l - 10) * 0.8),
  };

  const palette: PrimaryPalette = {} as PrimaryPalette;

  for (const tone of PRIMARY_TONES) {
    const targetLightness = lightnessMappings[tone];
    // Ajustar ligeramente la saturación para tonos muy claros y muy oscuros
    let adjustedSaturation = s;
    
    if (tone === "50" || tone === "100") {
      adjustedSaturation = Math.max(s * 0.3, 10);
    } else if (tone === "800" || tone === "900") {
      adjustedSaturation = Math.min(s * 1.1, 100);
    }

    palette[tone] = hslToHex(h, adjustedSaturation, targetLightness);
  }

  return palette;
}

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