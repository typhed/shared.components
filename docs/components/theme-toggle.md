<div align = "center">

# ThemeToggle

</div>

<div align = "justify">

`ThemeToggle` is a sliding light/dark switch in the header. The track holds both a Sun icon (left) and a Moon icon (right),
and a circular knob slides between them to indicate the active theme. A click toggles between light and dark. Until the
component mounts it shows the light position (sun), because the resolved theme is only known in the browser and a guess would
cause a hydration mismatch.

It is a Client Component (`"use client"`) that reads and sets the theme through `next-themes`. It is a native semantic switch
(`role="switch"` with `aria-checked`).

## Source And Import

  * **Source**: [packages/ui/components/theme-toggle.tsx](../../packages/ui/components/theme-toggle.tsx)
  * **Depends on**: `useTheme` from `next-themes`, `Sun` and `Moon` from `lucide-react`
  * **Requires**: a [ThemeProvider](theme-provider.md) ancestor

```tsx
import { ThemeToggle } from "@typhed/ui/components/theme-toggle"
```

## Props

`ThemeToggle` takes no props. It reads the active theme from context and toggles it.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| none | n/a | n/a | Behavior is fully driven by the `next-themes` context. |

## Behavior

  * **Mount guard**: a `mounted` flag stays false during server render and the first client paint, so the knob remains in the
    light/sun position. After mount it animates to the real theme. This is what prevents the hydration warning.
  * **Toggle**: `onClick` calls `setTheme(isDark ? "light" : "dark")`, where `isDark` is `resolvedTheme === "dark"`.
  * **Icon logic**: the track always shows both Sun (left) and Moon (right) in muted color; the animated knob slides to expose
    the active theme's icon through its cutout.

## Anatomy

It is a native `<button type="button" role="switch" aria-checked={isDark}>` that renders:

  * **Track**: a rounded-full pill (`h-8 w-14 rounded-full`) with `border-border` and `bg-secondary` fill, holding static Sun
    and Moon glyphs positioned at the left and right edges, both in `text-muted-foreground`.
  * **Knob**: an animated circular button (`h-6 w-6 rounded-full`) with `bg-primary` fill and `text-primary-foreground` icon,
    sliding left/right via `translate-x-0` (light) or `translate-x-6` (dark) to center on the active glyph.

## Colors And Tokens

See the `usage.theme_toggle` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml).

| Element | Token / Class |
| :---: | :---: |
| Track background | `bg-secondary` |
| Track border | `border-border` |
| Track icons | `text-muted-foreground` |
| Knob fill | `bg-primary` |
| Knob icon | `text-primary-foreground` |
| Hover | `hover:border-brand/50` |

The track uses the muted secondary surface; the knob uses primary (cyan in dark mode, indigo in light).

## Examples

```tsx
// In a header, opposite the brand mark.
<header className="flex items-center justify-between">
  <BrandMark />
  <ThemeToggle />
</header>
```

The component must sit inside a `ThemeProvider`. The app wires that in
`layout.tsx` with `defaultTheme="dark"`.

## Accessibility

The switch carries `role="switch"`, `aria-checked={isDark}` (true when dark, false when light), `aria-label="Toggle color theme"`,
and a matching `title`. The two track icons are `aria-hidden="true"` so they do not clutter screen readers. The focus ring is
applied via `focus-visible:ring-2 focus-visible:ring-ring` for keyboard navigation.

## Usage Guidelines

Render it once, inside a `ThemeProvider`. Do not duplicate it across the page; two toggles fight over the same context and
confuse users. The switch width is fixed at `w-14` to fit both glyphs; do not resize it. The knob slide distance is `translate-x-6`;
adjust only if the track width changes.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Keep it inside a `ThemeProvider`. | Render it with no theme context, leaving it inert. |
| Keep the mount guard (light position on server). | Render the resolved theme on the server and trigger a mismatch. |
| Keep `role="switch"` and `aria-checked`. | Replace with a Button or icon-only link. |
| Use one toggle per page. | Place multiple toggles that conflict. |
| Use semantic track styling (secondary + border). | Hardcode colors or remove the visual glyphs. |

</div>
