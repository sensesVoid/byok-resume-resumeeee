"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Applied glassmorphism styling
    className={cn("mb-4 overflow-hidden rounded-2xl border border-white/20 bg-card/60 shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out dark:bg-card/70", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex" asChild>
    <h2 className="w-full text-lg font-semibold">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group relative flex w-full flex-1 items-center justify-between overflow-hidden p-6 transition-all",
          props['data-powered'] === false
            ? "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30"
            : "bg-gradient-to-br from-white/10 to-transparent hover:bg-white/20 dark:from-white/5 dark:to-transparent dark:hover:bg-white/10",
          className
        )}
        {...props}
      >
        {/* Glow effect for powered ON state */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-400/20 via-sky-400/20 to-cyan-400/20 bg-[length:200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-data-[state=open]:opacity-100 group-data-[powered=true]:opacity-100 animate-flow-glow blur-lg" />
        <div className="relative z-10 flex w-full items-center justify-between">
          {children}
          <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </AccordionPrimitive.Trigger>
    </h2>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("px-6 pb-6 pt-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
