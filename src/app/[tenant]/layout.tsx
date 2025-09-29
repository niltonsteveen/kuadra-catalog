import type { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import {
  PRIMARY_COLOR_STORAGE_KEY,
  PRIMARY_PALETTE_STORAGE_KEY,
  PRIMARY_TONES,
  normalizePrimaryPalette,
} from "@/theme/colors";

type TenantConfig = {
  primaryColor?: string;
  colors?: { primary?: Partial<Record<string, string>> };
  style?: "moderno" | "clasico" | string;
  tokens?: { radius?: string };
  mode?: "light" | "dark" | "auto" | string;
  slug?: string;
};

export default async function TenantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const CONFIG_URL = process.env.NEXT_PUBLIC_MOCK_CONFIG_URL || "/api/mock-config";
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const url = CONFIG_URL.startsWith("http") ? CONFIG_URL : new URL(CONFIG_URL, base).toString();
  const res = await fetch(url, { cache: "no-store" });
  const config = (await res.json()) as TenantConfig;

  const palette = normalizePrimaryPalette(config?.colors?.primary ?? config?.primaryColor ?? null);
  const paletteCss = PRIMARY_TONES.map((tone) => `--kuadra-color-primary-${tone}:${palette[tone]};`).join("");
  const paletteJson = JSON.stringify(palette);
  const tonesJson = JSON.stringify(PRIMARY_TONES);
  const paletteStorageKey = PRIMARY_PALETTE_STORAGE_KEY;
  const primaryColorKey = PRIMARY_COLOR_STORAGE_KEY;

  const radius = config?.tokens?.radius ?? (config?.style === "clasico" ? "0px" : "0.75rem");
  const fontClass = config?.style === "clasico" ? "font-mono" : "font-sans";

  return (
    <div className={`min-h-screen ${fontClass}`}>
      {/* Inyeccion de variables de diseno por tenant */}
      <style>{`:root{${paletteCss}--radius-md:${radius};}`}</style>
      {/* Sincroniza preferencias iniciales y aplica overrides locales */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {try {
  const root=document.documentElement;
  const K='theme';
  const S='style';
  const R='radius';
  const P=${JSON.stringify(paletteStorageKey)};
  const C=${JSON.stringify(primaryColorKey)};
  const tones=${tonesJson};
  const basePalette=${paletteJson};
  const fallbackMode=${JSON.stringify(config?.mode ?? 'auto')};
  const fallbackStyle=${JSON.stringify(config?.style ?? 'moderno')};
  const H=new Date().getHours();
  const isNight=(H<7||H>=19);

  let storedMode=localStorage.getItem(K);
  if(!storedMode && (fallbackMode==='light'||fallbackMode==='dark'||fallbackMode==='auto')){
    storedMode=fallbackMode;
    localStorage.setItem(K, storedMode);
  }
  if(storedMode!=='light'&&storedMode!=='dark'&&storedMode!=='auto'){
    storedMode='auto';
  }
  const effective=storedMode==='dark'?'dark':storedMode==='light'?'light':(isNight?'dark':'light');
  if(effective==='dark'){root.classList.add('dark');} else {root.classList.remove('dark');}

  if(!localStorage.getItem(P)){
    localStorage.setItem(P, JSON.stringify(basePalette));
  }
  const storedPalette=localStorage.getItem(P);
  if(storedPalette){
    try {
      const parsed = JSON.parse(storedPalette);
      for (const tone of tones) {
        const direct = typeof parsed?.[tone] === 'string' ? parsed[tone] : null;
        const prefixed = typeof parsed?.['primary-'+tone] === 'string' ? parsed['primary-'+tone] : null;
        const value = prefixed || direct;
        if (value) {
          root.style.setProperty('--kuadra-color-primary-'+tone, value);
        }
      }
    } catch {}
  } else {
    const legacy = localStorage.getItem(C);
    if(legacy){root.style.setProperty('--kuadra-color-primary-500', legacy);}
  }

  const rd=localStorage.getItem(R); if(rd){root.style.setProperty('--radius-md', rd);}

  const resolveStyle = () => {
    const stored = localStorage.getItem(S);
    if(stored==='moderno'||stored==='clasico'){return stored;}
    if(fallbackStyle==='moderno'||fallbackStyle==='clasico'){
      localStorage.setItem(S, fallbackStyle);
      return fallbackStyle;
    }
    return 'moderno';
  };
  const applyStyle = () => {
    const body=document.body; if(!body) return;
    const current=resolveStyle();
    body.classList.remove('font-sans','font-mono');
    body.classList.add(current==='clasico'?'font-mono':'font-sans');
    root.classList.remove('modern','classic');
    root.classList.add(current==='clasico'?'classic':'modern');
  };
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', applyStyle);
  } else {
    applyStyle();
  }
} catch(_) {}})();`,
        }}
      />

      <header className="border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">Catalogo - {tenant}</h1>
          <nav className="text-sm space-x-4">
            <Link className="text-primary-600 underline" href={`/${tenant}`}>Inicio</Link>
            <Link className="text-primary-600 underline" href="/design-system">Design System</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
