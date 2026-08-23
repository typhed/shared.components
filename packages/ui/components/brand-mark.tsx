import * as React from "react"

import { SITE } from "@typhed/brand"
import { cn } from "../lib/utils"

type BrandMarkProps = {
  /** Render the "TyPhed" wordmark next to the mark. */
  showWordmark?: boolean
  className?: string
  glyphClassName?: string
  /**
   * Path to the mark asset. Defaults to the brand mark served from the app's
   * `public/brand/` directory. Overridable so the component stays testable and
   * decoupled from a single deployment layout.
   */
  markSrc?: string
}

/**
 * The TyPhed identity: the brand mark (the official gradient glyph shipped in
 * `public/brand/mark`) paired with the wordmark. The mark is a full-colour SVG
 * that reads on both themes, so a single asset serves light and dark; the
 * wordmark uses the display font and brand token from the app theme.
 *
 * The mark is rendered as an `<img>` referencing the canonical asset rather
 * than inlined, so the logo artwork lives in exactly one place and is never
 * re-drawn by hand.
 */
export function BrandMark({
  showWordmark = true,
  className,
  glyphClassName,
  markSrc = "/brand/mark/typhed-mark.svg",
}: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export
          runs with images.unoptimized; a plain <img> keeps @typhed/ui free of
          a next/image dependency. */}
      <img
        src={markSrc}
        alt={`${SITE.name} logo`}
        width={36}
        height={36}
        className={cn("h-9 w-9 object-contain", glyphClassName)}
      />
      {showWordmark ? (
        <span className="font-display text-xl font-semibold tracking-tight text-foreground">
          Ty<span className="text-brand">Phed</span>
        </span>
      ) : null}
    </span>
  )
}
