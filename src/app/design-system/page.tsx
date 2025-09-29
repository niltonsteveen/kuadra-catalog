import { headers } from "next/headers";
import { DesignControls } from "@/components/design-controls";

type CatalogConfig = {
  primaryColor?: string;
  colors?: { primary?: Partial<Record<string, string>> };
  style?: string;
  mode?: "light" | "dark" | "auto" | string;
  typography?: { sans?: string; heading?: string };
  tokens?: { radius?: string };
};

export default async function ComponentsCatalogPage() {
  const CONFIG_URL =
    process.env.NEXT_PUBLIC_MOCK_CONFIG_URL || "/api/mock-config";
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const url = CONFIG_URL.startsWith("http")
    ? CONFIG_URL
    : new URL(CONFIG_URL, base).toString();
  const res = await fetch(url, { cache: "no-store" });
  const config = (await res.json()) as CatalogConfig;

  return (
    <main className="mx-auto w-10/12 p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Componentes (Design System)</h1>
      </header>
      <DesignControls initial={config} />

      {/* Ejemplo de variantes por estilo (modern:/classic:) y variables */}
      <section className="space-y-3">
        <h2 className="text-xl font-medium">Ejemplo de variantes por estilo</h2>
        <div className="rounded-[var(--radius-md)] border modern:shadow-sm classic:shadow-none modern:px-6 classic:px-3 py-4 bg-white/50 dark:bg-neutral-900/50">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Esta tarjeta usa <code className="font-mono">modern:</code> y{" "}
            <code className="font-mono">classic:</code>, ademas de{" "}
            <code className="font-mono">rounded-[var(--radius-md)]</code>.
          </p>
        </div>
      </section>
    </main>
  );
}
