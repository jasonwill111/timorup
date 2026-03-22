import * as React from "react"
import { cn } from "@/lib/utils"
import { Accordion as BaseAccordion, AccordionItem as BaseAccordionItem, AccordionTrigger as BaseAccordionTrigger, AccordionContent as BaseAccordionContent } from "@base-ui/react/accordion"

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ value, children, className, ...props }, ref) => (
  <BaseAccordionItem
    ref={ref}
    value={value}
    className={cn("border-b", className)}
    {...props}
  >
    {children}
  </BaseAccordionItem>
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, ref) => (
  <BaseAccordionTrigger
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="h-4 w-4 shrink-0 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </BaseAccordionTrigger>
))
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, ref) => (
  <BaseAccordionContent
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[closed]:animate-accordion-up data-[open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </BaseAccordionContent>
))
AccordionContent.displayName = "AccordionContent"

// Simple Accordion component using native details/summary
interface SimpleAccordionProps {
  items: {
    id: string
    title: string
    content: React.ReactNode
  }[]
  className?: string
}

function SimpleAccordion({ items, className }: SimpleAccordionProps) {
  return (
    <div className={cn("divide-y divide-border rounded-md border", className)}>
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary className="flex cursor-pointer items-center justify-between py-4 font-medium transition-all hover:underline list-none">
            {item.title}
            <svg
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="pb-4 text-sm text-muted-foreground">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  )
}

export {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  SimpleAccordion,
}
