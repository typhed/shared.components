import * as React from "react"

import { SITE } from "@typhed/brand"
import { cn } from "../lib/utils"

type BrandLockupProps = {
  className?: string
  /** Paths to the light- and dark-theme lockup assets in `public/brand/lockup`. */
  lightSrc?: string
  darkSrc?: string
}

/**
 * The full TyPhed lockup — mark + wordmark + "Engineering Tomorrow" tagline —
 * as the official artwork shipped in `public/brand/lockup`. Two theme-specific
 * files exist (their tagline gradient and wordmark are tuned per theme), so
 * both are rendered and toggled with the `.dark` class rather than swapped in
 * JavaScript. That keeps the correct lockup visible from first paint in the
 * static export, with no hydration flash.
 *
 * Both images are decorative (`aria-hidden`) because one is always visually
 * hidden; a single `sr-only` label carries the accessible name so it stays
 * stable whichever theme is active.
 */
export function BrandLockup({
  className,
  lightSrc = "/brand/lockup/typhed-lockup-light.svg",
  darkSrc = "/brand/lockup/typhed-lockup-dark.svg",
}: BrandLockupProps) {
  const alt = `${SITE.name} — ${SITE.tagline}`
  return (
    <span className="inline-flex">
      {/* eslint-disable @next/next/no-img-element -- static export uses
          images.unoptimized; plain <img> keeps @typhed/ui next/image-free. */}
      <img
        src={lightSrc}
        alt=""
        aria-hidden="true"
        className={cn("block h-auto w-auto dark:hidden", className)}
      />
      <img
        src={darkSrc}
        alt=""
        aria-hidden="true"
        className={cn("hidden h-auto w-auto dark:block", className)}
      />
      {/* eslint-enable @next/next/no-img-element */}
      <span className="sr-only">{alt}</span>
    </span>
  )
}
