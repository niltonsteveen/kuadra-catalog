import * as SeparatorPrimitive from "@radix-ui/react-separator";
import clsx from "clsx";
import * as React from "react";

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  size?: "s" | "m" | "l";
  orientation?: "horizontal" | "vertical";
}

const Divider = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      size = "s",
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={clsx(
        "shrink-0 rounded-k-full bg-gray-500",
        orientation === "horizontal"
          ? size === "s"
            ? "h-[1px] w-full"
            : size === "m"
            ? "h-[2px] w-full"
            : "h-[4px] w-full"
          : size === "s"
          ? " w-[1px]"
          : size === "m"
          ? " w-[2px]"
          : " w-[4px]",
        className
      )}
      {...props}
    />
  )
);
Divider.displayName = SeparatorPrimitive.Root.displayName;

export { Divider };
