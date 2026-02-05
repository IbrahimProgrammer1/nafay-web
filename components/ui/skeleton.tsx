import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
