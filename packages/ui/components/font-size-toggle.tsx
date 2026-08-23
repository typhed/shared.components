"use client"

import * as React from "react"

import {
  FONT_SCALE_KEY,
  FONT_SCALE_LARGE,
  FONT_SCALE_NORMAL,
  FONT_SCALE_PROPERTY,
} from "../lib/font-scale"
import { cn } from "../lib/utils"

/**
 * Text-size switch styled as a sliding toggle, the twin of `ThemeToggle`: the
 * track carries a small and a large "A", and the knob slides to the active
 * side. It sets `--font-scale`, which the Tailwind preset multiplies into every
 * `text-*` size and `rem` line height and into nothing else, so the page gets
 * larger type rather than a browser-style zoom — spacing, heights, and gaps do
 * not move.
 *
 * Until mounted it renders in the normal position so the server markup matches
 * the first client render (the stored preference is only known in the browser),
 * then settles to the real one — this avoids a hydration mismatch. The page
 * itself is already at the right size by then: `SiteHeader` inlines a script
 * that applies the preference before paint, and this reads the result back.
 */
export function FontSizeToggle() {
  const [large, setLarge] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Read what the inline script already applied rather than storage, so the
    // knob can never disagree with the type on screen.
    const applied = document.documentElement.style.getPropertyValue(
      FONT_SCALE_PROPERTY,
    )
    setLarge(Number.parseFloat(applied) === FONT_SCALE_LARGE)
    setMounted(true)
  }, [])

  const isLarge = mounted && large

  const toggle = () => {
    const next = isLarge ? FONT_SCALE_NORMAL : FONT_SCALE_LARGE
    document.documentElement.style.setProperty(
      FONT_SCALE_PROPERTY,
      String(next),
    )

    try {
      window.localStorage.setItem(FONT_SCALE_KEY, String(next))
    } catch {
      // Private browsing or a partitioned storage context. The choice still
      // applies to this page; it just will not survive a reload.
    }

    setLarge(!isLarge)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLarge}
      aria-label="Toggle larger text"
      title="Toggle larger text"
      onClick={toggle}
      className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-secondary px-1 ring-offset-background transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/*
        The glyphs are deliberately sized with arbitrary values, which bypass
        the scale. A `text-*` utility here would grow the control along with the
        page and burst its fixed w-14 track.
      */}
      <span
        className="pointer-events-none absolute left-1.5 text-[0.625rem] font-semibold leading-none text-muted-foreground"
        aria-hidden="true"
      >
        A
      </span>
      <span
        className="pointer-events-none absolute right-1.5 text-[0.9375rem] font-semibold leading-none text-muted-foreground"
        aria-hidden="true"
      >
        A
      </span>
      <span
        className={cn(
          "pointer-events-none relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-200",
          isLarge ? "translate-x-6" : "translate-x-0",
        )}
      >
        {mounted ? (
          <span
            className={cn(
              "font-semibold leading-none",
              isLarge ? "text-[0.9375rem]" : "text-[0.625rem]",
            )}
            aria-hidden="true"
          >
            A
          </span>
        ) : null}
      </span>
    </button>
  )
}
