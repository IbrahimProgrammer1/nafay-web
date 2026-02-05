import * as React from "react"

import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:ring-offset-0",
        {
          "bg-accent-orange/10 text-accent-orange border-accent-orange/20":
            variant === "default",
          "bg-text-primary/5 text-text-primary border-text-primary/10":
            variant === "secondary",
          "bg-red-50 text-red-700 border-red-200":
            variant === "destructive",
          "bg-transparent text-text-primary border-text-primary/20": variant === "outline",
          "bg-green-50 text-green-700 border-green-200":
            variant === "success",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
