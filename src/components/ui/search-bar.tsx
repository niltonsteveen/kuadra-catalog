"use client";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";
import { Divider } from "./divider";
import { PopoverContent } from "./popover";
import { Input } from "./input";
import { Typography } from "../typography";
import { Button } from "./button";
import { Search, X } from "lucide-react";
import { IconButton } from "./icon-button";

// ---------------------------------------------------------------------
// 1) searchBarResultItemVariants   (hover:bg-secondary-100 active:bg-secondary-500 active:text-black hover:text-black data-[selected=true]:bg-secondary-500  )
// ---------------------------------------------------------------------
const searchBarResultItemVariants = cva(
  "flex items-center rounded-xs cursor-pointer dark:text-gray-100 text-black w-full ",
  {
    variants: {
      variant: {
        open: "py-m px-xs",
        nested: "p-xs",
        double: "p-xs",
      },
    },
    defaultVariants: {
      variant: "open",
    },
  }
);

// ---------------------------------------------------------------------
// 2) Contexto para heredar "variant" a los SearchBarResultItem
// ---------------------------------------------------------------------
const SearchBarVariantContext = React.createContext<
  VariantProps<typeof searchBarResultItemVariants>["variant"] | undefined
>(undefined);

// ---------------------------------------------------------------------
// 3) SearchBarProps: extiende PopoverPrimitive.Root + variant
// ---------------------------------------------------------------------
type SearchBarProps = VariantProps<typeof searchBarResultItemVariants> &
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

// ---------------------------------------------------------------------
// 4) SearchBar: El contenedor principal (Popover Root), con "variant" en contexto
// ---------------------------------------------------------------------
function SearchBar({ variant, children, ...props }: SearchBarProps) {
  return (
    <SearchBarVariantContext.Provider value={variant}>
      <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
    </SearchBarVariantContext.Provider>
  );
}
SearchBar.displayName = "SearchBar";

// ---------------------------------------------------------------------
// 5) SearchBarTrigger: Disparador (Popover Trigger).
//    Debe contener al <SearchBarDriver> si deseas posicionar el content debajo
// ---------------------------------------------------------------------
const SearchBarTrigger = PopoverPrimitive.Trigger;

// ---------------------------------------------------------------------
// 6) SearchBarDriver: El input en sí (TextInput).
//    - Al usarlo dentro de <SearchBarTrigger asChild>, ojo con el foco
// ---------------------------------------------------------------------
type SearchBarDriverProps = {
  onClear?: () => void;
  showPrefix?: boolean;
} & React.ComponentPropsWithoutRef<typeof Input>;

const SearchBarDriver = React.forwardRef<
  React.ComponentRef<typeof Input>,
  SearchBarDriverProps
>(
  (
    { className, value, placeholder, onClear, showPrefix = true, ...props },
    ref
  ) => {
    const showClear = Boolean(onClear) || Boolean(value);
    return (
      <Input
        ref={ref}
        className={cn("w-full", className)}
        placeholder={placeholder ?? "Buscar..."}
        {...props}
        value={value}
        prefixIcon={
          showPrefix ? (
            <IconButton
              variant={"secondary"}
              className="text-gray-900 dark:text-white"
            >
              <Search />
            </IconButton>
          ) : null
        }
        suffixIcon={
          showClear ? (
            <IconButton
              variant={"secondary"}
              className="dark:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear?.();
              }}
            >
              <X />
            </IconButton>
          ) : null
        }
      />
    );
  }
);
SearchBarDriver.displayName = "SearchBarDriver";

// ---------------------------------------------------------------------
// 7) SearchBarContent: Contenido (PopoverContent) con Command
// ---------------------------------------------------------------------

type SearchBarContentProps = {
  footer?: React.ReactNode;
  variant?: "nested" | "double" | "open";
  emptyMessage?: string;
} & React.ComponentPropsWithoutRef<typeof PopoverContent>;

const SearchBarContent = React.forwardRef<
  React.ComponentRef<typeof PopoverContent>,
  SearchBarContentProps
>(
  (
    {
      className,
      children,
      footer,
      variant,
      emptyMessage = "No se encontraron resultados.",
      ...props
    },
    ref
  ) => {
    return (
      <PopoverContent
        ref={ref}
        className={cn(
          "flex flex-col",
          variant === "open" ? "p-m" : " p-xs",
          className
        )}
        {...props}
      >
        <Command className="">
          <CommandList className="flex-1">
            <CommandEmpty className="p-xs text-center text-black">
              {emptyMessage}
            </CommandEmpty>
            <div className="flex flex-col gap-xs">{children}</div>
          </CommandList>
        </Command>

        {footer && (
          <div className="z-50 flex flex-col gap-xs">
            <Divider orientation="horizontal" />
            {footer}
          </div>
        )}
      </PopoverContent>
    );
  }
);

SearchBarContent.displayName = "SearchBarContent";

// ---------------------------------------------------------------------
// 8) SearchBarResultItem: cada resultado, hereda "variant" del contexto
// ---------------------------------------------------------------------
type SearchBarResultItemProps = {
  subTitle?: string;
  prefixElm?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof CommandItem> &
  VariantProps<typeof searchBarResultItemVariants>;

const SearchBarResultItem = React.forwardRef<
  React.ComponentRef<typeof CommandItem>,
  SearchBarResultItemProps
>(({ className, variant, prefixElm, children, subTitle, ...props }, ref) => {
  // Leer variant del contexto si no se pasó uno
  const contextVariant = React.useContext(SearchBarVariantContext);
  const finalVariant = variant ?? contextVariant ?? "open";

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "flex items-center gap-[14px]",
        searchBarResultItemVariants({ variant: finalVariant }),
        className
      )}
      {...props}
    >
      {prefixElm && <span>{prefixElm}</span>}
      <section className="flex flex-col gap-xxxs">
        {children}
        {!!subTitle && finalVariant === "double" && (
          <Typography size="xxs" weight="medium">
            {subTitle}
          </Typography>
        )}
      </section>
    </CommandItem>
  );
});
SearchBarResultItem.displayName = "SearchBarResultItem";

// ---------------------------------------------------------------------
// 9) SearchBarResultGroup: Agrupar items con label
// ---------------------------------------------------------------------
type SearchBarResultGroupProps = {
  label?: string;
  children: React.ReactNode;
  variant?: "nested" | "double" | "open";
} & React.ComponentPropsWithoutRef<typeof CommandGroup>;

const SearchBarResultGroup = React.forwardRef<
  React.ComponentRef<typeof CommandGroup>,
  SearchBarResultGroupProps
>(({ label, children, variant, ...props }, ref) => (
  <CommandGroup className="" ref={ref} {...props}>
    {label && (
      <Typography size="xxs" weight="medium" className="!text-gray-700">
        {label}
      </Typography>
    )}
    <div
      className={cn("flex flex-col", variant === "open" ? "gap-xs" : "gap-0")}
    >
      {children}
    </div>
  </CommandGroup>
));
SearchBarResultGroup.displayName = "SearchBarResultGroup";

// ---------------------------------------------------------------------
// 10) SearchBarFooter: contenedor al final del popover
// ---------------------------------------------------------------------
const SearchBarFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("sticky bottom-0 z-50 w-full bg-white", className)}
    {...props}
  >
    {children}
  </div>
);
SearchBarFooter.displayName = "SearchBarFooter";

// ---------------------------------------------------------------------
// 11) SearchBarFooterButton: botón en el footer
// ---------------------------------------------------------------------
const SearchBarFooterButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => (
  <Button
    variant="text"
    size="m"
    className={cn("w-full", className)}
    ref={ref}
    {...props}
  >
    <Typography size="xs" weight="bold" className="!text-gray-700">
      {children}
    </Typography>
  </Button>
));
SearchBarFooterButton.displayName = "SearchBarFooterButton";

// ---------------------------------------------------------------------
// Exportar todos los componentes
// ---------------------------------------------------------------------
export {
  SearchBar,
  SearchBarTrigger,
  SearchBarDriver,
  SearchBarContent,
  SearchBarResultItem,
  SearchBarResultGroup,
  SearchBarFooter,
  SearchBarFooterButton,
  searchBarResultItemVariants,
};
