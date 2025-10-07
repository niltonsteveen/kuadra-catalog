"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

type IconProps = {
  size?: "xs" | "s" | "m" | "l";
  name?: string;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const KuadraIcon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ size = "m", name, className }, ref) => {
    return (
      <figure
        className={cn(" flex items-center justify-center", {
          "h-10 w-10 text-4xl": size === "l",
          "h-6 w-6 text-2xl": size === "m",
          "h-5 w-5 text-xl": size === "s",
          "h-4 w-4 text-base": size === "xs",
        })}
        ref={ref}
      >
        <em className={cn(name, className)} />
      </figure>
    );
  }
);

KuadraIcon.displayName = "KuadraIcon";

export { KuadraIcon };
