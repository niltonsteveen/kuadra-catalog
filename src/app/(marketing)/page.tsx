import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Kuadra Catalog</h1>
        <p className="text-gray-600">Landing simple para marketing.</p>
        <p>
          <Link
            className="inline-block rounded-md border border-transparent bg-primary-500 px-3 py-1.5 text-white transition-colors hover:bg-primary-600"
            href="/micomercio"
          >
            Ir al comercio ficticio micomercio
          </Link>
        </p>
        <p>
          <Link className="text-primary-600 underline" href="/design-system">
            Ver catalogo publico de componentes
          </Link>
        </p>
        <div className="bg-success-500 p-s">
          <Typography
            size="xxl"
            weight="medium"
            styleKind="moderno"
            className="!text-error-900"
          >
            Texto en estilo clásico.
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-s">
          <Button disabled>Lorem ipsum dollor sit</Button>
          <Button suffixIcon={<SearchIcon />} prefixIcon={<SearchIcon />}>
            Lorem ipsum dollor sit
          </Button>
          <Button variant={"destructive"}>Lorem ipsum dollor sit</Button>
          <Button disabled size={"s"} variant={"secondary"}>
            Lorem ipsum dollor sit
          </Button>
          <Button size={"s"} variant={"secondary"}>
            Lorem ipsum dollor sit
          </Button>
          <Button size={"s"} variant={"destructive_secondary"}>
            Lorem ipsum dollor sit
          </Button>
          <Button size={"s"} variant={"text"}>
            Lorem ipsum dollor sit
          </Button>
          <Button variant={"link"}>Lorem ipsum dollor sit</Button>
        </div>
      </section>
    </main>
  );
}
