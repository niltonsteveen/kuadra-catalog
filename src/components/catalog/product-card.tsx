"use client";
import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Price from "@/components/ui/price";
import SizeSelect from "@/components/ui/size-selector";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export type ProductCardProps = {
  id: string;
  title: string;
  imageUrls: string[];
  priceType?: "regular" | "sale";
  price: string;
  oldPrice?: string;
  size?: "s" | "m" | "l";
  onAddToCart?: (id: string) => void;
  sizes?: Array<{ id: string; label: string; disabled?: boolean }>;
  selectedSizeId?: string;
  onChangeSize?: (sizeId: string) => void;
  className?: string;
};

const SIZE_PRESET: Record<
  NonNullable<ProductCardProps["size"]>,
  { wrapper: string }
> = {
  s: { wrapper: "w-[222px] h-[356px]" },
  m: { wrapper: "w-[300px] h-[456px]" },
  l: { wrapper: "w-[480px] h-[646px]" },
};

export default function ProductCard({
  id,
  title,
  imageUrls,
  priceType = "regular",
  price,
  oldPrice,
  size = "m",
  onAddToCart,
  sizes,
  selectedSizeId,
  onChangeSize,
  className,
}: ProductCardProps) {
  const titleId = useId();
  const preset = SIZE_PRESET[size];

  return (
    <section
      role="group"
      aria-labelledby={titleId}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        preset.wrapper,
        className
      )}
    >
      {/* Imagen/carrusel ocupa el espacio restante (crece en hover al ocultar titulo/precio) */}
      <Card className="relative flex-1 overflow-hidden bg-transparent">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {imageUrls.map((url, index) => (
              <CarouselItem
                key={index}
                className="relative h-full w-full bg-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover bg-transparent bg-center"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Botones de navegación visibles solo en hover */}
          <CarouselPrevious
            aria-label="Imagen anterior"
            className="hidden group-hover:flex hover:border-black hover:text-black"
          />
          <CarouselNext
            aria-label="Siguiente imagen"
            className="hidden group-hover:flex hover:border-black hover:text-black"
          />
        </Carousel>
      </Card>

      <div className="flex flex-col">
        {/* Default: titulo + precio visibles; Hover: ocultos */}
        <div className="flex flex-col gap-xxs">
          <div className="pt-xs group-hover:hidden">
            <Typography size="s" className=" truncate">
              {title}
            </Typography>
          </div>
          <div className="group-hover:hidden">
            <Price
              type={priceType}
              price={price}
              oldPrice={oldPrice}
              size="m"
            />
          </div>
        </div>

        {/* Hover: aparece size selector, reemplaza al titulo+precio (menos alto => imagen crece por flex-1) */}
        {sizes && (
          <div className="hidden pt-xs group-hover:block">
            <SizeSelect
              options={sizes}
              value={selectedSizeId}
              onChange={onChangeSize}
            />
          </div>
        )}

        <div>
          <Button
            aria-label="Agregar al carrito"
            onClick={() => onAddToCart?.(id)}
            className="mt-xs w-full transition flex items-center justify-center gap-2 modern:typo-s classic:typo-xs"
          >
            Agregar al carrito
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
