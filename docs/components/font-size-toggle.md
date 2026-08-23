<div align = "center">

# FontSizeToggle

</div>

<div align = "justify">

`FontSizeToggle` is the reader's text-size control in the header: two buttons, a small "A" to step down and a larger
"A" to step up. It offers seven steps, three either side of the default, and each step moves body copy by exactly 2.5
pixels. There is no reset; stepping back to the middle is what returns the page to 16px.

It changes the size of the **page content only**. The header, the footer, and the copyright bar keep the stock type at
every step, because the control writes its setting to a scope that covers `main` and nothing else. Chrome is not a
reading surface and does not follow the reader.

It also changes type **only**. No spacing, height, radius, or gap utility references the scale, so padding, the header
height, and the layout grid hold still while the words grow. That is what separates this control from browser zoom, and
it is the entire reason the mechanism exists.

It is a Client Component (`"use client"`) that writes `--font-scale-setting` onto `document.documentElement` and persists
the chosen step in `localStorage`.

## Source And Import

  * **Source**: [packages/ui/components/font-size-toggle.tsx](../../packages/ui/components/font-size-toggle.tsx)
  * **Constants and helpers**: [packages/ui/lib/font-scale.ts](../../packages/ui/lib/font-scale.ts)
  * **Depends on**: the `fontSize` scale and the reading-scope rule in
    [packages/config-tailwind/tailwind.config.js](../../packages/config-tailwind/tailwind.config.js)
  * **Requires**: a `main` element (or a `[data-font-scale-scope]` element) somewhere in the page. It is mounted by
    [SiteHeader](site-header.md) and needs no provider.

```tsx
import { FontSizeToggle } from "@typhed/ui/components/font-size-toggle"
```

## Props

`FontSizeToggle` takes no props. It reads the stored step on mount and writes the visitor's choice back.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| none | n/a | n/a | Behavior is fully driven by `--font-scale-setting` and `localStorage`. |

## The Steps

Seven levels. Each press moves body copy by `FONT_STEP_PX`, which is 2.5 pixels against the stock 16 pixel root. The
result is stored as a ratio so the rest of the type scale moves with it proportionally.

| Step | Multiplier | Body Copy | `text-sm` | `text-5xl` |
| :---: | ---: | ---: | ---: | ---: |
| `-3` | 0.53125 | 8.5px | 7.4px | 25.5px |
| `-2` | 0.68750 | 11.0px | 9.6px | 33.0px |
| `-1` | 0.84375 | 13.5px | 11.8px | 40.5px |
| `0` | 1.00000 | 16.0px | 14.0px | 48.0px |
| `1` | 1.15625 | 18.5px | 16.2px | 55.5px |
| `2` | 1.31250 | 21.0px | 18.4px | 63.0px |
| `3` | 1.46875 | 23.5px | 20.6px | 70.5px |

A ratio rather than a flat pixel offset, because a flat offset added to every size would leave `text-5xl` almost
unchanged while jumping `text-xs` by a fifth, flattening the type hierarchy a little further at each step. A ratio keeps
the page looking like itself at every level.

The step is what gets persisted, as a small integer. `clampFontStep` rounds and clamps everything read back from storage
as well as every button press, so a hand-edited value cannot push the page to an unreadable size.

## How The Scoping Works

Two custom properties, which is the whole trick:

| Property | Set On | Meaning |
| :---: | :---: | --- |
| `--font-scale-setting` | `<html>` | The visitor's choice. Written by the control and by the pre-paint script. |
| `--font-scale` | `:root`, then the scope | What every `text-*` utility multiplies by. |

The preset declares `--font-scale: 1` on `:root`, then redefines it on the reading scope:

```css
:root                            { --font-scale-setting: 1; --font-scale: 1; }
main, [data-font-scale-scope]    { --font-scale: var(--font-scale-setting, 1);
                                   font-size: calc(1rem * var(--font-scale, 1)); }

.text-sm { font-size: calc(0.875rem * var(--font-scale, 1)); line-height: calc(1.25rem * var(--font-scale, 1)); }
.h-16    { height: 4rem; }
```

Custom properties inherit, so everything inside `main` picks the reader's choice up, and everything outside it keeps the
`1` from `:root`. The header, the footer, and the copyright bar are excluded structurally rather than by opting out one
at a time. No component has to know it renders in the chrome in order to stay put, and a new footer link added tomorrow
is excluded automatically.

The `font-size` on the scope carries the choice to content wearing no `text-*` utility of its own.

### What Does And Does Not Scale

  * **Scales**: every `text-*` utility and every `rem` line height inside `main`. Unitless line heights (`text-5xl` and
    up) are already relative to the font size, as is every `em` value such as `tracking-tight`, so those follow for free.
  * **Never scales**: any spacing, height, width, radius, or gap utility, anywhere. Grepping the compiled stylesheet for
    `--font-scale` returns `font-size` and `line-height` and no other property. That is the invariant to protect.
  * **Never scales**: anything outside `main`, at any step.

### Arbitrary Sizes Opt Out By Default

An arbitrary value such as `text-[0.625rem]` bypasses the scale entirely, because Tailwind emits it verbatim. That is the
right default, since opting out stays trivial, but it means an arbitrary size inside `main` that **should** follow the
reader has to say so:

```tsx
// Opted in: this label follows the control.
<span className="text-[calc(0.625rem*var(--font-scale,1))]">Days</span>
```

Both call sites in this package are deliberate. [countdown-timer.tsx](../../packages/ui/components/countdown-timer.tsx)
opts its unit labels in. [wip-landing.tsx](../../packages/ui/components/wip-landing.tsx) opts its `h1` in **only up to
the existing ceiling**: the clamp exists so the headline fits inside one `min-h-dvh` snap section, and scaling the
`4.5rem` ceiling wraps it to three lines on a short laptop window and pushes the countdown out of view. The floor and the
fluid term scale; the ceiling does not.

Write no spaces inside the brackets. CSS needs whitespace around `+` and `-` inside `calc`, but not around `*`, and
Tailwind reads an unspaced arbitrary value cleanly.

## Anatomy

The root is a `<div role="group" aria-label="Text size">` styled as one segmented pill (`h-8 rounded-full border
border-border bg-secondary`), matching [ThemeToggle](theme-toggle.md) in height, width, and surface so the two read as a
pair. It holds two `<button>` elements, each `w-7`:

  1. **Decrease**: a small "A" at `text-[0.6875rem]`. Disabled at step `-3`.
  2. **Increase**: a larger "A" at `text-[0.9375rem]`. Disabled at step `3`.

Both glyph sizes are arbitrary values, which bypass the scale, so the control never resizes itself no matter where it is
placed. A visually hidden `aria-live="polite"` region follows the buttons and carries the resulting size after each
press.

## Behavior

  * **Mount guard**: a `mounted` flag stays false during server render and the first client paint, so the buttons render
    at the default step. After mount they settle to the stored one. This is what prevents the hydration warning.
  * **Persistence**: the chosen step is written to `localStorage` under `typhed-font-step`. The write is wrapped in `try`
    / `catch`, because private browsing and partitioned storage both throw; the choice still applies to the current page
    when it cannot be saved.
  * **First paint**: [SiteHeader](site-header.md) inlines a small script that applies the saved step before the page
    below it paints, the same trick `next-themes` uses for the colour theme. Without it, a visitor on a non-default size
    would watch the page render at 16px and then reflow.

## Colors And Tokens

See the `usage.theme_toggle` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml);
this control deliberately reuses the same tokens.

| Element | Token / Class |
| :---: | :---: |
| Group background | `bg-secondary` |
| Group border | `border-border` |
| Glyphs (resting) | `text-muted-foreground` |
| Glyphs (hover) | `hover:text-brand` |
| Group border (hover) | `hover:border-brand/50` |
| Disabled button | `disabled:opacity-30` |
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
// A surface that should follow the reader without being a <main>.
<aside data-font-scale-scope>
  <ArticleSidebar />
</aside>
```

```tsx
// Reading or setting the step from outside the component.
import {
  fontScaleForStep,
  FONT_SCALE_SETTING_PROPERTY,
  FONT_STEP_KEY,
} from "@typhed/ui/lib/font-scale"

document.documentElement.style.setProperty(
  FONT_SCALE_SETTING_PROPERTY,
  String(fontScaleForStep(2)),
)
window.localStorage.setItem(FONT_STEP_KEY, "2")
```

## Accessibility

  * The group carries `role="group"` with `aria-label="Text size"`, so the two buttons are announced as one control
    rather than a pair of loose letters.
  * Each button has an explicit `aria-label` and a matching `title`: "Decrease text size" and "Increase text size".
  * Both "A" glyphs are `aria-hidden="true"`, so a screen reader announces the label rather than the letter.
  * A button is `disabled` at the end of its range, which both stops the press and tells assistive technology that the
    limit has been reached.
  * The buttons say what they do but never where the reader ended up, so a visually hidden `aria-live="polite"` region
    announces the result after each press ("Text size: +5px", or "Text size: default").
  * The focus ring uses `focus-visible:ring-2 focus-visible:ring-ring` and is raised above its neighbours with
    `focus-visible:relative focus-visible:z-10`, so it is not clipped by the group's `overflow-hidden`.
  * As native `<button>` elements they respond to both Space and Enter and need no key handling of their own.
  * The control is an accessibility affordance in its own right. It gives a reader larger type without the layout reflow
    browser zoom forces, which is what makes it usable on the snap-scrolling single-page layout.

## Usage Guidelines

Render it once, inside `SiteHeader`. Do not duplicate it; two groups fight over the same custom property.

Every number lives in [lib/font-scale.ts](../../packages/ui/lib/font-scale.ts). To change how far a press moves the page,
edit `FONT_STEP_PX`; to change how many presses there are, edit `FONT_STEP_MIN` and `FONT_STEP_MAX`. The pre-paint script
is generated from the same constants, so it follows automatically. Nothing else needs touching.

Be deliberate about widening the range. At step `-3` body copy is already 8.5px and `text-xs` is 7.4px, which is at the
edge of legible; the small end exists for readers who want more on screen, not as a size anyone should land on by
accident.

`FONT_SCALE_SCRIPT` is deliberately one single template literal. Splitting it across two joined by `+` reads better at
this width, but Next's SWC minifier folds the two and drops the first one's trailing characters on the way, shipping a
script that cannot parse. Nothing fails loudly when that happens; the preference simply stops applying before paint. If
that line ever needs to grow, verify the emitted `<script>` in a production build rather than trusting the source.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Let the scope decide what follows the reader. | Opt individual chrome components out one at a time. |
| Keep the header, footer, and copyright outside `main`. | Wrap the whole layout in `main` and let the chrome resize. |
| Let every text size resolve through `--font-scale`. | Reference the property from a spacing, height, or gap utility. |
| Keep the mount guard (default step on the server). | Render the stored step on the server and trigger a mismatch. |
| Clamp every step through `clampFontStep`. | Trust an integer read back from `localStorage`. |
| Opt an arbitrary size in with an explicit `calc`. | Assume `text-[...]` follows the control on its own. |
| Change the range by editing the constants. | Hardcode a step count in the component or the script. |
| Keep the pre-paint script as one template literal. | Split it with `+` and let the minifier silently break it. |

</div>
