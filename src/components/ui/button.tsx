import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-s whitespace-nowrap rounded-radius-s transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white hover:bg-primary-300 active:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:border disabled:border-gray-500 hover:font-bold active:font-bold",
        destructive:
          "bg-error-500 text-white hover:bg-error-300 active:bg-error-700 hover:font-bold active:font-bold",
        secondary:
          "border border-primary-500 text-primary-500 hover:bg-primary-300 hover:border-none hover:text-white hover:font-bold active:font-bold active:bg-primary-700 active:border-none active:text-white disabled:border-gray-500 disabled:text-gray-500",
        destructive_secondary:
          "border border-error-500 text-error-500 hover:bg-error-300 hover:border-none hover:text-white hover:font-bold active:font-bold active:bg-error-700 active:border-none active:text-white disabled:border-gray-500 disabled:text-gray-500",
        text: "text-primary-500 hover:border hover:border-primary-500 hover:font-bold active:border active:border-primary-700 active:text-primary-700 active:font-bold disabled:border-gray-500 disabled:text-gray-500",
        destructive_text:
          "text-error-500 hover:border hover:border-error-500 hover:font-bold active:border active:border-error-700 active:text-error-700 active:font-bold disabled:border-gray-500 disabled:text-gray-500",
        link: "text-primary-500 hover:text-primary-300 active:text-primary-700 active:font-bold underline",
      },
      size: {
        m: "h-[59px] p-s typo-s",
        s: "h-[56px] p-s typo-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "m",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  prefixIcon,
  suffixIcon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {prefixIcon}
      {children}
      {suffixIcon}
    </Comp>
  );
}

export { Button, buttonVariants };
