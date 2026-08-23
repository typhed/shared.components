"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { LAUNCH_DATE } from "@typhed/brand"
import { cn } from "../lib/utils"

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

const ZERO: TimeParts = { days: 0, hours: 0, minutes: 0, seconds: 0, done: false }

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const

function getRemaining(targetMs: number): TimeParts {
  const diff = targetMs - Date.now()
  if (diff <= 0) {
    return { ...ZERO, done: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: false,
  }
}

/**
 * Live countdown to the launch date. The first paint (server export and
 * initial client render) shows zeros so hydration matches; the real values
 * appear after mount and tick every second. Honours reduced-motion by
 * dropping the per-second digit animation.
 */
export function CountdownTimer({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false)
  const [time, setTime] = React.useState<TimeParts>(ZERO)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const target = LAUNCH_DATE.getTime()
    setMounted(true)
    setTime(getRemaining(target))

    const id = window.setInterval(() => {
      setTime(getRemaining(target))
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  if (mounted && time.done) {
    return (
      <div className={cn("text-center", className)}>
        <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          We are live.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Welcome to the future we engineered.</p>
      </div>
    )
  }

  return (
    <div
      className={cn("flex w-full max-w-full items-end justify-center gap-1.5 sm:gap-4", className)}
      role="timer"
      aria-label="Time remaining until launch"
    >
      {UNITS.map((unit, index) => {
        const value = time[unit.key]
        const display = String(value).padStart(2, "0")
        return (
          <React.Fragment key={unit.key}>
            <div className="flex flex-col items-center">
              <div className="group relative grid h-20 w-14 place-items-center overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-lg shadow-brand/5 backdrop-blur-xl sm:h-28 sm:w-24">
                <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.04]" />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={display}
                    initial={reduceMotion ? false : { y: "-55%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { y: "55%", opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-3xl font-semibold tabular-nums text-foreground sm:text-5xl"
                    suppressHydrationWarning
                  >
                    {display}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="mt-3 text-[calc(0.625rem*var(--font-scale,1))] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                {unit.label}
              </span>
            </div>
            {index < UNITS.length - 1 ? (
              <span
                aria-hidden="true"
                className="hidden font-display text-2xl font-light text-brand/50 sm:mb-9 sm:block sm:text-4xl"
              >
                :
              </span>
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
