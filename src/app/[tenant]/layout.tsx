import type { ReactNode } from "react";
import { headers } from "next/headers";

export default async function TenantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const CONFIG_URL = process.env.NEXT_PUBLIC_MOCK_CONFIG_URL || "/api/mock-config";
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const url = CONFIG_URL.startsWith("http") ? CONFIG_URL : new URL(CONFIG_URL, base).toString();
  const res = await fetch(url, { cache: "no-store" });
  const config = (await res.json()) as {
    primaryColor: string;
    style: "moderno" | "clasico" | string;
    tokens?: { radius?: string };
    mode?: "light" | "dark" | "auto";
    slug?: string;
  };

  const primary = config?.primaryColor ?? "oklch(0.65 0.20 300)";
  const radius = config?.tokens?.radius ?? (config?.style === "clasico" ? "0px" : "0.75rem");
  const fontClass = config?.style === "clasico" ? "font-mono" : "font-sans";

  return (
    <div className={`min-h-screen ${fontClass}`}>
      {/* Inyección de variables de diseño por tenant */}
      <style>{`:root{--kuadra-color-primary-500:${primary};--radius-md:${radius};}`}</style>
      {/* Si el usuario no tiene preferencia, establece la del comercio y aplica de inmediato */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {try {
  const has = localStorage.getItem('theme');
  const mode = ${JSON.stringify(config?.mode ?? 'auto')};
  const style = ${JSON.stringify(config?.style ?? 'moderno')};
  if(!has && (mode==='light'||mode==='dark'||mode==='auto')){
    localStorage.setItem('theme', mode);
    // Aplicar inmediatamente
    const H=new Date().getHours(); const isNight=(H<7||H>=19);
    const eff = mode==='dark'?'dark':mode==='light'?'light':(isNight?'dark':'light');
    const root=document.documentElement; eff==='dark'?root.classList.add('dark'):root.classList.remove('dark');
  }
  // Establece estilo si no hay preferencia local
  const hasStyle = localStorage.getItem('style');
  if(!hasStyle && (style==='moderno'||style==='clasico')){
    localStorage.setItem('style', style);
    const root=document.documentElement;
    root.classList.remove('modern','classic');
    root.classList.add(style==='clasico'?'classic':'modern');
  }
  // Overrides locales de color, si existen
  const localColor = localStorage.getItem('primaryColor'); if(localColor){document.documentElement.style.setProperty('--kuadra-color-primary-500', localColor);}  
  const localRadius = localStorage.getItem('radius'); if(localRadius){document.documentElement.style.setProperty('--radius-md', localRadius);}  
} catch(_) {}})();`,
        }}
      />

      <header className="border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">Catálogo · {tenant}</h1>
          <nav className="text-sm space-x-4">
            <a className="text-blue-600 underline" href={`/${tenant}`}>Inicio</a>
            <a className="text-blue-600 underline" href="/design-system">Design System</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
