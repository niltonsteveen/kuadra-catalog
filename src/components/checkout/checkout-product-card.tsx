"use client";
import React, { useId, useRef } from "react";
import Price from "@/components/ui/price";
import Counter from "@/components/ui/counter";
import { cn } from "@/lib/utils";
import { Typography } from "../typography";

export type CheckoutProductCardProps = {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  price: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
  quantity: number;
  className?: string;
};

export default function CheckoutProductCard({
  imageUrl,
  imageAlt,
  title,
  price,
  onIncrement,
  onDecrement,
  quantity,
  className,
}: CheckoutProductCardProps) {
  const titleId = useId();
  const lastQty = useRef(quantity);

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={cn(
        "flex items-start gap-s bg-white dark:bg-neutral-900 transition",
        className
      )}
    >
      {/* Left: Image */}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt ?? title}
          className="w-[134px] h-[143px] modern:rounded-radius-s classic:rounded-none object-cover bg-gray-200"
        />
      ) : (
        <div
          aria-hidden
          className="w-[134px] h-[143px] modern:rounded-radius-s classic:rounded-none bg-gray-200"
        />
      )}

      {/* Center: Content */}
      <div className="flex flex-col flex-1">
        <Typography id={titleId} size="s" weight="regular" className="truncate">
          {title}
        </Typography>
        <div className="mt-xs">
          <Price size="m" type="regular" price={price} />
        </div>
        <div className="mt-s">
          <Counter
            value={quantity}
            onUpdate={(next) => {
              if (next > lastQty.current) {
                onIncrement?.();
              } else if (next < lastQty.current) {
                onDecrement?.();
              }
              lastQty.current = next;
            }}
          />
        </div>
      </div>
    </div>
  );
}
