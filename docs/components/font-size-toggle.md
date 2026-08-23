<div align = "center">

# FontSizeToggle

</div>

<div align = "justify">

`FontSizeToggle` is a sliding text-size switch in the header, the twin of [ThemeToggle](theme-toggle.md). The track holds
a small "A" (left) and a large "A" (right), and a circular knob slides between them to indicate the active size. A click
switches between the normal scale and the larger one. Until the component mounts it shows the normal position, because
the stored preference is only known in the browser and a guess would cause a hydration mismatch.

It grows **type only**. Every `text-*` utility resolves through the `--font-scale` custom property, and no spacing,
height, radius, or gap utility ever references it, so padding, the header height, and the layout grid hold still while
the words get bigger. That is the difference between this control and browser zoom, and it is the entire reason the
mechanism exists.

It is a Client Component (`"use client"`) that reads and writes `--font-scale` on `document.documentElement` and persists
the choice in `localStorage`. It is a native semantic switch (`role="switch"` with `aria-checked`).

## Source And Import

  * **Source**: [packages/ui/components/font-size-toggle.tsx](../../packages/ui/components/font-size-toggle.tsx)
  * **Constants**: [packages/ui/lib/font-scale.ts](../../packages/ui/lib/font-scale.ts)
  * **Depends on**: the `fontSize` scale in
    [packages/config-tailwind/tailwind.config.js](../../packages/config-tailwind/tailwind.config.js)
  * **Requires**: nothing at runtime. It is mounted by [SiteHeader](site-header.md) and needs no provider.

```tsx
import { FontSizeToggle } from "@typhed/ui/components/font-size-toggle"
```

## Props

`FontSizeToggle` takes no props. It reads the active scale from the document and writes the visitor's choice back.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| none | n/a | n/a | Behavior is fully driven by `--font-scale` and `localStorage`. |

## How The Scale Works

The preset in [tailwind.config.js](../../packages/config-tailwind/tailwind.config.js) restates Tailwind's stock type
scale through a `scaled()` helper, so every size becomes a multiple of one custom property:

```css
.text-sm { font-size: calc(0.875rem * var(--font-scale, 1)); line-height: calc(1.25rem * var(--font-scale, 1)); }
.h-16    { height: 4rem; }
```

  * **Font sizes and `rem` line heights** are multiplied. Unitless line heights (`text-5xl` and up) are already relative
    to the font size and scale on their own, as does every `em` value such as `tracking-tight`.
  * **Nothing else is.** Grepping the compiled stylesheet for `--font-scale` returns `font-size` and `line-height` and no
    other property. That is the invariant to protect.
  * **The `, 1` fallback** means a page that never sets the property renders at exactly the stock Tailwind size, so the
    default view is unchanged from before the control existed.
  * `<body>` also carries `font-size: calc(1rem * var(--font-scale, 1))`, which catches text wearing no `text-*` utility.

| Step | `--font-scale` | `text-base` Resolves To |
| :---: | :---: | ---: |
| Normal | `1` | 16px |
| Large | `1.25` | 20px |

### Arbitrary Sizes Opt Out By Default

An arbitrary value such as `text-[0.625rem]` bypasses the scale entirely, because Tailwind emits it verbatim. That is the
right default, since opting out stays trivial, but it means an arbitrary size that **should** follow the control has to
say so:

```tsx
// Opted in: this label grows with the control.
<span className="text-[calc(0.625rem*var(--font-scale,1))]">Days</span>

// Opted out: this glyph must not grow, or it bursts its fixed-width track.
<span className="text-[0.9375rem]">A</span>
```

Both call sites in this package are deliberate. [countdown-timer.tsx](../../packages/ui/components/countdown-timer.tsx)
opts its unit labels in. [wip-landing.tsx](../../packages/ui/components/wip-landing.tsx) opts its `h1` in **only up to
the existing ceiling**: the clamp exists so the headline fits inside one `min-h-dvh` snap section, and scaling the
`4.5rem` ceiling wraps it to three lines on a short laptop window and pushes the countdown out of view. The floor and the
fluid term scale; the ceiling does not.

Write no spaces inside the brackets. CSS needs whitespace around `+` and `-` inside `calc`, but not around `*`, and
Tailwind reads an unspaced arbitrary value cleanly.

## Anatomy

It is a native `<button type="button" role="switch" aria-checked={isLarge}>` that renders:

  * **Track**: a rounded-full pill (`h-8 w-14 rounded-full`) with `border-border` and `bg-secondary` fill, holding a
    small "A" at `left-1.5` and a large "A" at `right-1.5`, both in `text-muted-foreground`. Identical geometry to
    [ThemeToggle](theme-toggle.md), so the two switches read as one pair.
  * **Knob**: an animated circle (`h-6 w-6 rounded-full`) with `bg-primary` fill and `text-primary-foreground` glyph,
    sliding via `translate-x-0` (normal) or `translate-x-6` (large).
  * **Glyph sizing**: all three "A" glyphs use arbitrary sizes (`text-[0.625rem]` and `text-[0.9375rem]`) precisely so
    they do **not** scale. A `text-*` utility here would grow the control along with the page and burst its fixed `w-14`
    track.

## Behavior

  * **Mount guard**: a `mounted` flag stays false during server render and the first client paint, so the knob remains in
    the normal position. After mount it settles to the real one. This is what prevents the hydration warning.
  * **Reading the current value**: on mount it reads `--font-scale` back off `document.documentElement.style` rather than
    re-reading `localStorage`, so the knob can never disagree with the type actually on screen.
  * **Toggle**: `onClick` writes the next scale onto `document.documentElement` and to `localStorage`. The storage write
    is wrapped in `try` / `catch`, because private browsing and partitioned storage both throw; the choice still applies
    to the current page when it cannot be saved.
  * **First paint**: [SiteHeader](site-header.md) inlines a small script that applies the saved value before the page
    below it paints, the same trick `next-themes` uses for the colour theme. Without it, a visitor on the larger setting
    would watch the page render at the default size and then reflow.

## Colors And Tokens

See the `usage.theme_toggle` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml);
this control deliberately reuses the same tokens.

| Element | Token / Class |
| :---: | :---: |
| Track background | `bg-secondary` |
| Track border | `border-border` |
| Track glyphs | `text-muted-foreground` |
| Knob fill | `bg-primary` |
| Knob glyph | `text-primary-foreground` |
| Hover | `hover:border-brand/50` |
| Focus ring | `ring-ring` |

## Examples

```tsx
// Already mounted by SiteHeader, immediately left of the theme switch.
<div className="flex items-center gap-2 sm:gap-4">
  <FontSizeToggle />
  <ThemeToggle />
</div>
```

```tsx
// Reading or setting the scale from outside the component.
import {
  FONT_SCALE_KEY,
  FONT_SCALE_LARGE,
  FONT_SCALE_PROPERTY,
} from "@typhed/ui/lib/font-scale"

document.documentElement.style.setProperty(
  FONT_SCALE_PROPERTY,
  String(FONT_SCALE_LARGE),
)
window.localStorage.setItem(FONT_SCALE_KEY, String(FONT_SCALE_LARGE))
```

## Accessibility

  * The switch carries `role="switch"`, `aria-checked={isLarge}` (true when large, false when normal),
    `aria-label="Toggle larger text"`, and a matching `title`.
  * All three "A" glyphs are `aria-hidden="true"` so a screen reader announces the label rather than three stray letters.
  * The focus ring is applied via `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` for keyboard
    navigation, and is bright in both themes.
  * As a native `<button>`, it responds to both Space and Enter and needs no key handling of its own.
  * The control is an accessibility affordance in its own right. It gives a visitor larger type without the layout
    reflow that browser zoom forces, which is what makes it usable on the snap-scrolling single-page layout.

## Usage Guidelines

Render it once, inside `SiteHeader`. Do not duplicate it across the page; two switches fight over the same custom
property and confuse users. The track width is fixed at `w-14` to fit both glyphs, matching `ThemeToggle`; do not resize
it. The knob slide distance is `translate-x-6`; adjust only if the track width changes.

Both steps live in [lib/font-scale.ts](../../packages/ui/lib/font-scale.ts). To change how large "large" is, edit
`FONT_SCALE_LARGE` there and nothing else. Keep the value modest: the header is a fixed `h-16` and does not grow, so a
scale much beyond `1.25` starts to crowd the nav links against it.

`FONT_SCALE_SCRIPT` is deliberately one single template literal. Splitting it across two joined by `+` reads better at
this width, but Next's SWC minifier folds the two and drops the first one's trailing `");` on the way, shipping a script
that cannot parse. Nothing fails loudly when that happens; the preference simply stops applying before paint. If that
line ever needs to grow, verify the emitted `<script>` in a production build rather than trusting the source.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Let every text size resolve through `--font-scale`. | Reference the property from a spacing, height, or gap utility. |
| Keep the mount guard (normal position on the server). | Render the stored scale on the server and trigger a mismatch. |
| Keep `role="switch"` and `aria-checked`. | Replace it with a Button or an icon-only link. |
| Use one switch per page. | Place multiple switches that fight over the property. |
| Size the "A" glyphs with arbitrary values. | Use a `text-*` utility on them and let the control grow itself. |
| Opt an arbitrary size in with an explicit `calc`. | Assume `text-[...]` follows the control on its own. |
| Keep the pre-paint script as one template literal. | Split it with `+` and let the minifier silently break it. |

</div>
