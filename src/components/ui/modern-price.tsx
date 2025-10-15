import React from "react";
import { cn } from "@/lib/utils";

type Size = "s" | "m" | "l";
type Kind = "regular" | "sale";

export type ModernPriceProps = {
  size: Size;
  type: Kind;
  price: string;
  oldPrice?: string;
  className?: string;
};

const SIZE_CLASS: Record<Size, string> = {
  s: "typo-xs font-medium",
  m: "typo-s font-normal",
  l: "typo-m font-normal",
};

export default function ModernPrice({
  size,
  type,
  price,
  oldPrice,
  className,
}: ModernPriceProps) {
  if (type === "regular") {
    return (
      <span className={cn(SIZE_CLASS[size], "text-black", className)}>
        {price}
      </span>
    );
  }

  // const wrapper =
  //   size === "l" ? "flex flex-col" : "inline-flex items-baseline ";

  return (
    <span className={cn("inline-flex items-baseline gap-xs", className)}>
      {oldPrice ? (
        <span className={cn(SIZE_CLASS[size], "text-gray-700 line-through")}> 
          {oldPrice}
        </span>
      ) : null}
      <span className={cn(SIZE_CLASS[size], "text-black")}>{price}</span>
    </span>
  );
}
