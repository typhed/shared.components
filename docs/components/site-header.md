<div align = "center">

# SiteHeader

</div>

<div align = "justify">

`SiteHeader` is the permanent top menu bar. It stays visible while the single-page layout scrolls, stickied with a
translucent backdrop-blur so content remains legible as sections pass beneath it. The left side shows the brand logo;
the desktop right side shows the primary nav links, the Login / Sign Up call-to-action, the text-size control, the
light/dark switch, and the mobile menu button. The mobile menu collapses the nav and CTA into a full-width hamburger
panel.

The header never resizes itself. [FontSizeToggle](font-size-toggle.md) only reaches the reading scope the preset opens on
`main`, so the toolbar keeps the stock type at every step, as do the footer and the copyright bar.

It is a Server Component. Both the desktop and mobile nav read `NAV_LINKS` and `LOGIN_CTA` from
[@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts), so the two never drift. The
`FontSizeToggle`, `ThemeToggle`, and `MobileNav` children are Client Components that handle their own state and
interactivity.

## Source And Import

  * **Source**: [packages/ui/components/site-header.tsx](../../packages/ui/components/site-header.tsx)
  * **Data**: `NAV_LINKS`, `LOGIN_CTA`, and `SITE` from [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts)
  * **Depends on**: [BrandMark](brand-mark.md), [FontSizeToggle](font-size-toggle.md), [ThemeToggle](theme-toggle.md),
    [Button](button.md), [MobileNav](#mobile-nav)

```tsx
import { SiteHeader } from "@typhed/ui/components/site-header"
```

## Props

Both props are slots for the sign-in control. They exist so this package carries no auth dependency of its own: a Clerk
import here would couple every TyPhed property to one site's auth choice. When either is omitted, that side falls back to
a plain link to `LOGIN_CTA`, so the header is still complete with no arguments at all.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `authSlot` | `React.ReactNode` | `undefined` | The desktop sign-in control, shown from the `md` breakpoint up. Falls back to a `Button` linking to `LOGIN_CTA`. |
| `mobileAuthSlot` | `React.ReactNode` | `undefined` | Forwarded to `MobileNav` as its `authSlot`, for the hamburger panel. Falls back to a full-width `Button` linking to `LOGIN_CTA`. |

Everything else is read from constants rather than passed in.

## Anatomy

The root is a sticky `<header>` at `top-0 z-40` spanning the full viewport width. Its first child is an inline
`<script>` carrying `FONT_SCALE_SCRIPT` from [lib/font-scale.ts](../../packages/ui/lib/font-scale.ts). It applies the
visitor's saved text size before the page below it paints, the same trick `next-themes` uses for the colour theme.
The header rather than the toggle carries it because a Server Component this close to the top of the body is parsed
before any readable text renders; without it, a visitor on the larger setting watches the page render at the default
size and then reflow. The tag is `display: none` and never affects layout.

  1. **Logo link**: an `<a href="/">` wrapping `<BrandMark />` with `aria-label`. It carries a focus ring for keyboard
     navigation.
  2. **Desktop nav** (hidden on mobile, shown md and above): a `<nav aria-label="Primary">` row of anchor links, one per
     entry in `NAV_LINKS`. External links get `target="_blank"` and `rel="noopener noreferrer"`. Links are quiet at rest
     (`text-muted-foreground`), brighten on hover (`hover:text-foreground`).
  3. **Login / Sign Up** (hidden on mobile, shown md and above): a `Button variant="default" size="sm"` as an anchor. The
     label and href come from `LOGIN_CTA` in [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts), so both desktop and
     mobile use the same CTA text and destination. Currently links to `#` (placeholder until the auth flow exists).
  4. **Font Size Toggle**: a [FontSizeToggle](font-size-toggle.md) group of three buttons (smaller, reset, larger)
     stepping the page content through seven text sizes, 2.5px apart. It sets `--font-scale-setting`, which only reaches
     `main`, so the header itself never moves. The reset hides below `sm` to keep the toolbar on one row; both steppers
     stay at every breakpoint.
  5. **Theme Toggle**: a [ThemeToggle](theme-toggle.md) component that lets users switch between dark and light themes.
  6. **Mobile Menu Button** (hidden md and above): a hamburger `Button variant="ghost" size="icon"` that toggles the mobile
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

```tsx
// With an auth control injected through the slots, which is how a property
// with a sign-in flow calls it. The package still imports no auth library.
<SiteHeader
  authSlot={<AuthControls />}
  mobileAuthSlot={<AuthControls className="w-full" />}
/>
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
  * The two controls keep their own contracts, recorded on [font-size-toggle.md](font-size-toggle.md) and
    [theme-toggle.md](theme-toggle.md). The text-size control is a `role="group"` of labelled buttons with a live region;
    the theme control is a `role="switch"` with `aria-checked`. Both stay reachable at every breakpoint, so a phone
    reader can still resize the page.
  * The inline script is inert markup with no accessible representation. It sets a CSS custom property and nothing else.

## Usage Guidelines

Render `SiteHeader` once in the root layout. Drive the nav links from `NAV_LINKS` in constants. When you add new routes,
add them to the links list; do not hardcode them in the header. Keep the focus ring visible on the logo link for keyboard
accessibility. The mobile menu state is local to `MobileNav` and closes on link click or Escape; do not try to control it
from above.

Leave the inline `<script>` as the first child of `<header>`. It is placed there so it parses before any readable text
below it, which is what keeps a saved text size from flashing at the default on load. Moving it later, or into
`FontSizeToggle` itself, reintroduces the reflow.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Add nav links via `NAV_LINKS` in constants. | Hardcode route anchors inside the header. |
| Keep the logo link accessible name and focus ring. | Remove focus styles or make the logo non-clickable. |
| Keep external links with `rel="noopener noreferrer"`. | Open external links without the safe `rel`. |
| Let the mobile menu close itself on link click. | Try to control menu state from the parent. |
| Use the focus ring on the mobile hamburger button. | Remove or hide the focus ring for appearance. |
| Pass the sign-in control through `authSlot`. | Import an auth library into this package. |
| Keep the pre-paint script first inside `<header>`. | Move it below the toolbar and let the text size flash. |

</div>
