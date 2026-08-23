"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"

import { LOGIN_CTA, NAV_LINKS } from "@typhed/brand"
import { Button } from "./ui/button"

/**
 * The small-screen counterpart to the desktop nav in `SiteHeader`. A
 * hamburger toggle opens a full-width panel below the sticky header that
 * lists the same `NAV_LINKS` plus the Login / Sign Up call-to-action.
 *
 * The call-to-action is a slot: pass `authSlot` to inject an auth control
 * (e.g. a Clerk Login / UserButton); when omitted it falls back to a plain
 * link to `LOGIN_CTA`. Interacting with the slot closes the panel.
 *
 * Only the open/close state lives here, keeping the rest of the header a
 * Server Component. The panel is anchored to the (sticky, hence
 * positioned) `<header>` via `top-full`. It closes on link click and on
 * Escape; the default closed state matches the server render, so there is
 * no hydration mismatch.
 */
export function MobileNav({ authSlot }: { authSlot?: React.ReactNode } = {}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-50 border-b border-border/40 bg-background/95 backdrop-blur-md"
        >
          <nav aria-label="Primary" className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            {authSlot ? (
              <div className="mt-2" onClick={() => setOpen(false)}>
                {authSlot}
              </div>
            ) : (
              <Button asChild variant="default" size="sm" className="mt-2 w-full">
                <a href={LOGIN_CTA.href} onClick={() => setOpen(false)}>
                  {LOGIN_CTA.label}
                </a>
              </Button>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  )
}
