import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
} & React.ComponentProps<"input">;

function Input({
  className,
  type,
  prefixIcon,
  suffixIcon,
  ...props
}: InputProps) {
  return (
    <div className="relative bg-white dark:bg-[#383838] modern:rounded-full classic:rounded-none p-xxs">
      {prefixIcon && (
        <div className="absolute left-xxs top-1/2 -translate-y-1/2">
          {prefixIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "placeholder:text-gray-700 bg-gray-100 focus:bg-gray-200 focus:text-black focus:font-medium dark:placeholder:text-gray-500 dark:bg-gray-900 dark:focus:bg-black dark:focus:text-gray-100 dark:focus:font-medium h-[48px] w-full min-w-0 modern:rounded-full classic:rounded-none typo-xs transition-[color,box-shadow] outline-none  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          prefixIcon ? "pl-xxl" : "pl-s",
          suffixIcon ? "pl-xxl" : "pl-s",
          className
        )}
        {...props}
      />
      {suffixIcon && (
        <div className="absolute right-xxs top-1/2 -translate-y-1/2">
          {suffixIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
