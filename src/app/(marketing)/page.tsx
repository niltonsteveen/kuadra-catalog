import { Typography } from "@/components/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
          <Typography size="xxl" weight="medium" className="!text-error-900">
            Texto en estilo clásico.
          </Typography>
        </div>
        <div className="">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div>
          <Carousel className="w-full ">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </main>
  );
}
