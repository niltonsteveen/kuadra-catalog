export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Kuadra Catalog</h1>
        <p className="text-gray-600">Landing simple para marketing.</p>
        <p>
          <a className="inline-block rounded-md border px-3 py-1.5 bg-[var(--kuadra-color-primary-500)] text-white"
             href="/micomercio">
            Ir al comercio ficticio “micomercio”
          </a>
        </p>
        <p>
          <a className="text-blue-600 underline" href="/design-system">
            Ver catálogo público de componentes
          </a>
        </p>
      </section>
    </main>
  );
}
