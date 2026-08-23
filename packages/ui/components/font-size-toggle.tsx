"use client"

import * as React from "react"

import {
  clampFontStep,
  fontScaleForStep,
  FONT_SCALE_SETTING_PROPERTY,
  FONT_STEP_KEY,
  FONT_STEP_MAX,
  FONT_STEP_MIN,
  FONT_STEP_PX,
} from "../lib/font-scale"
import { cn } from "../lib/utils"

/**
 * Shared by both buttons so the pair reads as one segmented control. The glyph
 * size is set per button and uses an arbitrary value, which bypasses the scale:
 * the control must never resize itself, wherever it is placed.
 */
const CONTROL =
  "inline-flex h-full w-7 items-center justify-center font-semibold leading-none text-muted-foreground transition-colors hover:text-brand focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"

/**
 * Text-size control for the page's reading area: a small "A" to step down and a
 * larger "A" to step up.
 *
 * Seven steps, three either side of the default, each moving body copy by
 * 2.5px (8.5px at the smallest, 16px at rest, 23.5px at the largest). The rest
 * of the type scale moves proportionally, so the hierarchy between a heading
 * and a caption survives at every step. Each button disables at its end of the
 * range, which is how the reader knows there is nowhere further to go.
 *
 * It sets `--font-scale-setting` on `<html>`, which the Tailwind preset hands
 * to `main` and to anything marked `data-font-scale-scope`. Page content
 * inherits it; the header, footer, and copyright bar sit outside that subtree
 * and keep the stock size, so the chrome stays put while the reading area
 * responds. Spacing, heights, and gaps never reference the property, which is
 * what makes this different from browser zoom.
 *
 * Until mounted it renders at the default step so the server markup matches the
 * first client render (the stored choice is only known in the browser), then
 * settles to the real one - this avoids a hydration mismatch. The page itself
 * is already at the right size by then: `SiteHeader` inlines a script that
 * applies the preference before paint, and this reads the result back.
 */
export function FontSizeToggle() {
  const [step, setStep] = React.useState(0)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    let stored = 0

    try {
      stored = clampFontStep(Number(window.localStorage.getItem(FONT_STEP_KEY)))
    } catch {
      // Private browsing or a partitioned storage context. Stay at the default.
    }

    setStep(stored)
    setMounted(true)
  }, [])

  // Before mount the buttons must agree with the server render, not with
  // storage.
  const current = mounted ? step : 0

  const apply = (next: number) => {
    const clamped = clampFontStep(next)

    document.documentElement.style.setProperty(
      FONT_SCALE_SETTING_PROPERTY,
      String(fontScaleForStep(clamped)),
    )

    try {
      window.localStorage.setItem(FONT_STEP_KEY, String(clamped))
    } catch {
      // The choice still applies to this page; it just will not survive a
      // reload.
    }

    setStep(clamped)
  }

  const offset = current * FONT_STEP_PX
  const label =
    current === 0
      ? "Text size: default"
      : `Text size: ${offset > 0 ? "+" : ""}${offset}px`

  return (
    <div
      role="group"
      aria-label="Text size"
      className="inline-flex h-8 shrink-0 items-center overflow-hidden rounded-full border border-border bg-secondary transition-colors hover:border-brand/50"
    >
      <button
        type="button"
        onClick={() => apply(current - 1)}
        disabled={current <= FONT_STEP_MIN}
        aria-label="Decrease text size"
        title="Decrease text size"
        className={cn(CONTROL, "pl-0.5 text-[0.6875rem]")}
      >
        <span aria-hidden="true">A</span>
      </button>

      <button
        type="button"
        onClick={() => apply(current + 1)}
        disabled={current >= FONT_STEP_MAX}
        aria-label="Increase text size"
        title="Increase text size"
        className={cn(CONTROL, "pr-0.5 text-[0.9375rem]")}
      >
        <span aria-hidden="true">A</span>
      </button>

      {/*
        The buttons only ever announce what they do, never where the reader
        ended up. This says that, once, after each press.
      */}
      <span aria-live="polite" className="sr-only">
        {mounted ? label : null}
      </span>
    </div>
  )
}
