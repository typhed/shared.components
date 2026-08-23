import * as React from "react"

import { LAUNCH_LABEL, SITE } from "@typhed/brand"
import { CountdownTimer } from "./countdown-timer"
import { LaunchProgress } from "./launch-progress"

/**
 * The "work in progress" hero: the first full-height section of the
 * single-page layout. The site chrome (header, footer, animated backdrop)
 * is supplied by the app layout, so this renders only the holding-page
 * content and snaps into view as its own viewport-height section.
 */
export function WipLanding() {
  return (
    <section className="relative flex min-h-dvh snap-start flex-col items-center justify-center px-4 py-[clamp(1rem,3vh,3rem)] text-center sm:px-6">
      {/*
        The floor and the fluid term follow the text-size control; the 4.5rem
        ceiling deliberately does not. This clamp exists so the headline fits
        inside one min-h-dvh section, and scaling the ceiling wraps it to three
        lines on a short laptop window, pushing the countdown out of view.
      */}
      <h1 className="animate-fade-up font-display text-[clamp(calc(2.25rem*var(--font-scale,1)),calc(8vmin*var(--font-scale,1)),4.5rem)] font-semibold leading-[1.05] tracking-tight">
        <span className="sr-only">{SITE.name} - </span>
        <span className="block text-foreground">Engineering</span>
        <span className="block bg-gradient-to-r from-brand via-brand to-brand-2 bg-clip-text text-transparent">
          Tomorrow
        </span>
      </h1>

      <p className="mt-[clamp(0.75rem,2.5vh,1.75rem)] max-w-xl animate-fade-up text-balance text-base text-muted-foreground sm:text-lg">
        Something Extraordinary is in the Making!
      </p>

      <CountdownTimer className="mt-[clamp(1rem,4vh,3rem)] animate-fade-up" />

      <LaunchProgress className="mt-[clamp(0.75rem,3vh,2.5rem)] w-full max-w-md animate-fade-up" />

      <p className="mt-[clamp(0.5rem,2.5vh,2rem)] animate-fade-up text-sm text-muted-foreground">
        Target Launch Date{" "}
        <span className="font-medium text-foreground">{LAUNCH_LABEL}</span>
      </p>
    </section>
  )
}
