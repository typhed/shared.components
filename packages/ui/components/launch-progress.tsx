"use client"

import * as React from "react"

import { LAUNCH_DATE, LAUNCH_START_DATE } from "@typhed/brand"
import { cn } from "../lib/utils"

const DAY_MS = 86_400_000

/**
 * Progress bar for the run-up to launch. The fill is the share of the
 * window from LAUNCH_START_DATE to LAUNCH_DATE that has already elapsed,
 * so it grows from 0% at the start date to 100% at launch. The fill uses
 * the same brand gradient as the "Tomorrow" wordmark.
 *
 * Hydration-safe: renders empty until mounted, then animates to the real
 * value, which also gives a pleasant fill-in on load.
 */
export function LaunchProgress({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false)
  const [percent, setPercent] = React.useState(0)
  const [daysLeft, setDaysLeft] = React.useState(0)

  React.useEffect(() => {
    const start = LAUNCH_START_DATE.getTime()
    const end = LAUNCH_DATE.getTime()

    const tick = () => {
      const now = Date.now()
      const ratio = ((now - start) / (end - start)) * 100
      setPercent(Math.min(100, Math.max(0, ratio)))
      setDaysLeft(Math.max(0, Math.ceil((end - now) / DAY_MS)))
    }

    setMounted(true)
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const rounded = Math.round(percent)

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.18em] text-muted-foreground">Launch progress</span>
        <span className="font-medium tabular-nums text-foreground" suppressHydrationWarning>
          {mounted ? `${rounded}%` : "0%"}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Progress to launch"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={mounted ? rounded : 0}
        aria-valuetext={mounted ? `${rounded} percent, ${daysLeft} days to launch` : undefined}
        className="h-2.5 w-full overflow-hidden rounded-full border border-border/50 bg-secondary/60"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand via-brand to-brand-2 shadow-[0_0_12px_hsl(var(--brand)/0.55)] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: mounted ? `${percent}%` : "0%" }}
        />
      </div>

      <p
        className="mt-2 text-right text-xs tabular-nums text-muted-foreground"
        suppressHydrationWarning
      >
        {mounted ? `${daysLeft} days to launch` : ""}
      </p>
    </div>
  )
}
