<div align = "center">

# SiteHeader

</div>

<div align = "justify">

`SiteHeader` is the permanent top menu bar. It stays visible while the single-page layout scrolls, stickied with a
translucent backdrop-blur so content remains legible as sections pass beneath it. The left side shows the brand logo;
the desktop right side shows the primary nav links, the Login / Sign Up call-to-action, the theme toggle, and the mobile
menu button. The mobile menu collapses the nav and CTA into a full-width hamburger panel.

It is a Server Component. Both the desktop and mobile nav read `NAV_LINKS` and `LOGIN_CTA` from
[@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts), so the two never drift. The `ThemeToggle` and `MobileNav` children
are Client Components that handle their own state and interactivity.

## Source And Import

  * **Source**: [packages/ui/components/site-header.tsx](../../packages/ui/components/site-header.tsx)
  * **Data**: `NAV_LINKS`, `LOGIN_CTA`, and `SITE` from [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts)
  * **Depends on**: [BrandMark](brand-mark.md), [ThemeToggle](theme-toggle.md), [Button](button.md), [MobileNav](#mobile-nav)

```tsx
import { SiteHeader } from "@typhed/ui/components/site-header"
```

## Props

`SiteHeader` takes no props. It reads brand and navigation data from constants.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| none | n/a | n/a | Fully self-contained; call it with no arguments. |

## Anatomy

The root is a sticky `<header>` at `top-0 z-40` spanning the full viewport width.

  1. **Logo link**: an `<a href="/">` wrapping `<BrandMark />` with `aria-label`. It carries a focus ring for keyboard
     navigation.
  2. **Desktop nav** (hidden on mobile, shown md and above): a `<nav aria-label="Primary">` row of anchor links, one per
     entry in `NAV_LINKS`. External links get `target="_blank"` and `rel="noopener noreferrer"`. Links are quiet at rest
     (`text-muted-foreground`), brighten on hover (`hover:text-foreground`).
  3. **Login / Sign Up** (hidden on mobile, shown md and above): a `Button variant="default" size="sm"` as an anchor. The
     label and href come from `LOGIN_CTA` in [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts), so both desktop and
     mobile use the same CTA text and destination. Currently links to `#` (placeholder until the auth flow exists).
  4. **Theme Toggle**: a `ThemeToggle` component that lets users switch between dark and light themes.
  5. **Mobile Menu Button** (hidden md and above): a hamburger `Button variant="ghost" size="icon"` that toggles the mobile
     nav panel. See the **Mobile Navigation** section below.

### Mobile Navigation

The `MobileNav` child component is a Client Component that handles the hamburger menu on small screens. It wraps a Button
(the hamburger toggle) and a conditionally rendered full-width panel.

  * **Toggle button**: a `Button` with `aria-label` ("Open menu" when closed, "Close menu" when open), `aria-expanded`
    (true/false), and `aria-controls="mobile-menu"`. The icon swaps between `Menu` and `X` from `lucide-react`.
  * **Menu panel**: a `<div id="mobile-menu">` positioned `absolute inset-x-0 top-full z-50` below the header. It contains a
    `<nav aria-label="Primary">` listing the same `NAV_LINKS` plus a full-width Login button (from `LOGIN_CTA`). Each link has an `onClick`
    that closes the menu.
  * **Keyboard support**: pressing Escape while the menu is open closes it.
  * **State**: the default closed state matches the server render (no hydration mismatch).

## Colors And Tokens

See the `usage.header_backdrop` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml).

| Element | Token / Class |
| :---: | :---: |
| Background | `bg-background/70` with `backdrop-blur-md` |
| Top border | `border-border/40` |
| Logo link focus ring | `focus-visible:ring-2 focus-visible:ring-ring` |
| Nav link resting | `text-muted-foreground` |
| Nav link hover | `hover:text-foreground` |
| Mobile menu panel background | `bg-background/95` with `backdrop-blur-md` |
| Mobile menu panel border | `border-border/40` |
| Mobile link hover fill | `hover:bg-accent` |

## Examples

```tsx
// SiteHeader is called once in the root layout.
import { SiteHeader } from "@typhed/ui/components/site-header"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```json
// Add a nav link by editing the brand contract, not the component.
// shared.documents/brand/navigation.json
{
  "nav": [
    { "label": "Our Products", "href": "#" },
    { "label": "About Us", "href": "/about" }
  ]
}
```

## Accessibility

  * The logo link carries `aria-label={SITE.name + " home"}` so it has an accessible name.
  * The logo link includes `focus-visible:ring-2 focus-visible:ring-ring`, which keeps it visible to keyboard users.
  * The desktop nav has `aria-label="Primary"` so screen readers announce its purpose.
  * Each external link uses `rel="noopener noreferrer"`, a security and privacy safeguard.
  * The hamburger toggle has `aria-label` ("Open menu" / "Close menu"), `aria-expanded` (true/false), and
    `aria-controls="mobile-menu"`, which links the button to the panel it controls.
  * The mobile menu panel has `id="mobile-menu"`, matching the button's `aria-controls`.
  * Each mobile nav link has an `onClick` that closes the menu, so screen reader users are not trapped.

## Usage Guidelines

Render `SiteHeader` once in the root layout. Drive the nav links from `NAV_LINKS` in constants. When you add new routes,
add them to the links list; do not hardcode them in the header. Keep the focus ring visible on the logo link for keyboard
accessibility. The mobile menu state is local to `MobileNav` and closes on link click or Escape; do not try to control it
from above.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Add nav links via `NAV_LINKS` in constants. | Hardcode route anchors inside the header. |
| Keep the logo link accessible name and focus ring. | Remove focus styles or make the logo non-clickable. |
| Keep external links with `rel="noopener noreferrer"`. | Open external links without the safe `rel`. |
| Let the mobile menu close itself on link click. | Try to control menu state from the parent. |
| Use the focus ring on the mobile hamburger button. | Remove or hide the focus ring for appearance. |

</div>
