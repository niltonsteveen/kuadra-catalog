"use client";
import React from "react";
import { cn } from "@/lib/utils";
import TopBarMenu from "@/components/topbar/topbar-menu";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AlignJustify, Search, ShoppingCart } from "lucide-react";
import { IconButton } from "../ui/icon-button";

export type TopBarGeneralProps = {
  logo: React.ReactNode;
  menuItems: Array<{ id: string; label: string; href?: string }>;
  activeId?: string;
  onClickSearch?: () => void;
  onClickCart?: () => void;
  forceMobile?: boolean;
  className?: string;
};

export default function TopBarGeneral({
  logo,
  menuItems,
  activeId,
  onClickSearch,
  onClickCart,
  forceMobile = false,
  className,
}: TopBarGeneralProps) {
  return (
    <div
      role="navigation"
      aria-label="Menú principal"
      className={cn(
        "rounded-radius-m bg-white dark:bg-[#383838] px-m flex items-center justify-center gap-m",
        className
      )}
      data-testid="topbar-general"
    >
      <div className="h-full flex" data-testid="topbar-general:logo">
        {logo}
      </div>

      <div className="flex-1 min-w-0" data-testid="topbar-general:menu">
        {forceMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <IconButton
                aria-label="Abrir menú"
                data-testid="topbar-general:btn-hamburger"
                variant="secondary"
              >
                <AlignJustify />
              </IconButton>
            </DrawerTrigger>
            <DrawerContent className="p-4" data-testid="topbar-general:sheet">
              {/* A11y title required by dialog: visually hidden */}
              <DrawerHeader className="sr-only">
                <DrawerTitle>Menú</DrawerTitle>
              </DrawerHeader>
              <div className="flex items-center justify-between mb-xs">
                <div className="h-full flex items-center">{logo}</div>
                <div className="flex items-center gap-xs">
                  <Button
                    variant="text"
                    aria-label="Buscar"
                    data-testid="topbar-general:btn-search"
                    onClick={onClickSearch}
                  >
                    <Search />
                  </Button>
                  <Button
                    variant="text"
                    aria-label="Abrir carrito"
                    data-testid="topbar-general:btn-cart"
                    onClick={onClickCart}
                  >
                    <ShoppingCart />
                  </Button>
                </div>
              </div>
              <TopBarMenu
                items={menuItems}
                activeId={activeId}
                onSelect={() => {}}
                className="flex flex-col gap-1"
              />
            </DrawerContent>
          </Drawer>
        ) : (
          <TopBarMenu items={menuItems} activeId={activeId} />
        )}
      </div>

      <div className="flex items-center gap-1">
        <IconButton
          aria-label="Buscar"
          data-testid="topbar-general:btn-search"
          onClick={onClickSearch}
          variant="secondary"
        >
          <Search />
        </IconButton>
        <IconButton
          aria-label="Abrir carrito"
          data-testid="topbar-general:btn-cart"
          onClick={onClickCart}
          variant="secondary"
        >
          <ShoppingCart />
        </IconButton>
      </div>
    </div>
  );
}
