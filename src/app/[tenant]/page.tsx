export default async function TenantHome({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const CONFIG_URL = process.env.NEXT_PUBLIC_MOCK_CONFIG_URL || "/api/mock-config";
  const { headers } = await import("next/headers");
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const url = CONFIG_URL.startsWith("http") ? CONFIG_URL : new URL(CONFIG_URL, base).toString();
  const res = await fetch(url, { cache: "no-store" });
  const config = (await res.json()) as {
    images?: { logo?: string; banner?: string };
    slug?: string;
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Inicio del catálogo</h2>
        <p className="text-gray-600">
          Comercio: <span className="font-mono">{tenant}</span>
        </p>
      </header>

      {/* Banner si existe */}
      {config?.images?.banner ? (
        <div className="overflow-hidden rounded-md border">
          <img
            src={config.images.banner}
            alt="Banner del comercio"
            className="w-full h-48 object-cover"
          />
        </div>
      ) : (
        <div className="h-24 rounded-md border bg-gray-100/50 flex items-center justify-center text-gray-500 text-sm">
          Banner placeholder
        </div>
      )}

      {/* Logo si existe */}
      <div className="flex items-center gap-4">
        {config?.images?.logo ? (
          <img
            src={config.images.logo}
            alt="Logo del comercio"
            className="h-12 w-auto"
          />
        ) : (
          <div className="h-12 w-12 rounded-md border bg-gray-100/50 flex items-center justify-center text-gray-500 text-xs">
            Logo
          </div>
        )}
        <div className="text-sm text-gray-600">{config?.slug ?? tenant}</div>
      </div>

      {/* Bloques vacíos para categorías destacadas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-md border p-4 min-h-32">Categoría 1</div>
        <div className="rounded-md border p-4 min-h-32">Categoría 2</div>
        <div className="rounded-md border p-4 min-h-32">Categoría 3</div>
      </section>
    </section>
  );
}
