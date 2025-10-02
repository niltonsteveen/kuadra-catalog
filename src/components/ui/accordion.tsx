"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("last:border-b-0 space-y-xs", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "bg-gray-400 dark:bg-gray-900 flex flex-1 items-center justify-between gap-xs modern:rounded-radius-s classic:rounded-none p-xs h-[44px] lg:p-s lg:h-[60px] text-left typo-xs lg:typo-s font-normal text-gray-900 dark:text-gray-200 transition-all outline-none hover:bg-gray-500 dark:hover:bg-gray-800 hover:border hover:border-gray-700 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 data-[state=open]:font-bold data-[state=open]:border data-[state=open]:border-gray-700 data-[state=open]:bg-gray-500 dark:data-[state=open]:bg-black",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-gray-900 dark:text-gray-200 pointer-events-none size-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
