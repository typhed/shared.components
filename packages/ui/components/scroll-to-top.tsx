"use client"

import * as React from "react"
import { ChevronUp } from "lucide-react"

import { cn } from "../lib/utils"

/**
 * A "back to top" affordance fixed at the bottom-center of the viewport. It
 * stays hidden near the top of the page and fades in once the visitor has
 * scrolled down, then smoothly returns them to the top on click. The chevron
 * lifts on hover. Kept out of the tab order and the a11y tree while hidden.
 */
export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "group fixed bottom-6 left-1/2 z-40 inline-flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground shadow-lg ring-offset-background backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  )
}
