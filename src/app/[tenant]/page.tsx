import ProductCard from "@/components/catalog/product-card";
import { Typography } from "@/components/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default async function TenantHome({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  const CONFIG_URL =
    process.env.NEXT_PUBLIC_MOCK_CONFIG_URL || "/api/mock-config";
  const { headers } = await import("next/headers");
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const url = CONFIG_URL.startsWith("http")
    ? CONFIG_URL
    : new URL(CONFIG_URL, base).toString();
  const res = await fetch(url, { cache: "no-store" });
  const config = (await res.json()) as {
    images?: { logo?: string; banner?: string };
    slug?: string;
  };

  return (
    <section className="flex flex-col">
      {/* Banner fijo (temporal) */}
      <div className="overflow-hidden relative h-[628px] z-10">
        <Image
          src="/temporal/banner1.svg"
          alt="Banner del comercio"
          fill
          priority
          className="object-cover z-10"
        />
      </div>

      {/* Logo si existe */}
      {/* <div className="flex items-center h-[628px] gap-4">
        {config?.images?.logo ? (
          <Image
            src={config.images.logo}
            alt="Logo del comercio"
            width={192}
            height={628}
            className="h-full w-auto"
            priority
          />
        ) : (
          <div className="h-12 w-12 rounded-md border bg-gray-100/50 flex items-center justify-center text-gray-500 text-xs">
            Logo
          </div>
        )}
        <div className="text-sm text-gray-600">{config?.slug ?? tenant}</div>
      </div> */}

      <section className="rounded-radius-l -mt-10 bg-white dark:bg-[#383838] z-20 flex p-5xl justify-center flex-col gap-4xl">
        <Typography size="xl" weight="bold" className="text-center">
          Nombre de categoría
        </Typography>
        <div className="grid grid-cols-4 gap-x-l gap-y-4xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard
              key={`p-s2-${i}`}
              id={`p-s2-${i}`}
              title="Product Name and other details"
              imageUrls={[
                "/temporal/product1.svg",
                "/temporal/product2.svg",
                "/temporal/product3.svg",
                "/temporal/product4.svg",
              ]}
              priceType="regular"
              price="$99.900"
              size="s"
              sizes={[
                { id: "s", label: "S" },
                { id: "m", label: "M" },
                { id: "l", label: "L" },
                { id: "xl", label: "XL" },
                { id: "xxl", label: "XXL", disabled: true },
              ]}
            />
          ))}
        </div>
      </section>
      <section className="p-5xl">
        <figure className=" h-[497px] relative ">
          <Image
            src="/temporal/banner2.svg"
            alt="Banner del comercio"
            fill
            priority
            className="object-cover z-10 rounded-radius-s"
          />
        </figure>
      </section>
      <section className="flex flex-col gap-m p-5xl">
        <Typography size="l" weight="bold" className="text-center">
          Adipiscing lobortis pellentesque.
        </Typography>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Lorem ipsum dolor sit amet</AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Ut enim ad minim veniam</AccordionTrigger>
            <AccordionContent>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
      </section>
    </section>
  );
}
