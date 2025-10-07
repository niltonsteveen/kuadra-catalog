"use client";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const iconButtonVariants = cva("flex items-center justify-center shrink", {
  variants: {
    variant: {
      default:
        "bg-primary-500 text-white hover:bg-primary-300 active:bg-primary-700 disabled:text-gray-500 disabled:bg-gray-100 ",
      defaultDestructive:
        "bg-error-500 text-white hover:bg-error-300 active:bg-error-700 disabled:text-gray-500 disabled:bg-gray-100",
      secondary:
        "text-primary-500 hover:bg-primary-200 hover:text-white active:bg-primary-500 active:text-white disabled:text-gray-500 disabled:bg-transparent",
      secondaryDestructive:
        "bg-white border text-error-500 border-error-500 hover:bg-error-300 hover:border-none hover:text-white active:bg-error-700 active:border-none active:text-white disabled:text-gray-500 disabled:bg-transparent disabled:border-none",
    },
    size: {
      s: "p-xs modern:rounded-radius-s classic:rounded-none h-[48px] w-[48px]",
      //   m: "p-xs rounded-k-s h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "s",
  },
});

export type IconButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants>;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant, size, asChild = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size }), className)}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <span>{children}</span>
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
