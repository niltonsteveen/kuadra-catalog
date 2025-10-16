"use client";
import React from "react";
import ProductCard from "@/components/catalog/product-card";

export default function ProductsGrid({ cols = 4 }: { cols?: 2 | 3 | 4 }) {
  const size = cols === 4 ? "s" : cols === 3 ? "m" : "l";
  const gridCols =
    cols === 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2";
  const images = [
    "/temporal/product1.svg",
    "/temporal/product2.svg",
    "/temporal/product3.svg",
    "/temporal/product4.svg",
  ];
  return (
    <div className={`grid ${gridCols} gap-x-m gap-y-l w-fit mx-auto`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <ProductCard
          key={`prod-${i}`}
          id={`prod-${i}`}
          title="Product Name and other details"
          imageUrls={[images[i % 4], images[(i + 1) % 4]]}
          priceType="regular"
          price="$99.900"
          size={size as any}
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
  );
}
