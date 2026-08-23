<div align = "center">

# AbstractBackground

</div>

<div align = "justify">

`AbstractBackground` is the decorative, theme-aware backdrop for a page. It layers a soft radial brand glow, a
faint masked grid, three drifting blurred orbs, and a depth vignette to read as something abstract and fluid. The motion
is pure CSS, so it costs no JavaScript, and it stops for anyone who prefers reduced motion.

It is a Server Component and carries `aria-hidden="true"` because it holds no information.

## Source And Import

  * **Source**: [packages/ui/components/abstract-background.tsx](../../packages/ui/components/abstract-background.tsx)

```tsx
import { AbstractBackground } from "@typhed/ui/components/abstract-background"
```

## Props

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `className` | `string` | `undefined` | Extra classes merged onto the root with `cn`. Use it to adjust positioning or opacity, not to recolor. |

## Anatomy

The root is `pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background`, so it pins to the viewport, sits
behind page content, and ignores the pointer. Four layers stack inside it.

  1. **Top brand glow**: a radial gradient from `hsl(var(--brand)/0.18)` to transparent, anchored above the top edge.
  2. **Masked grid**: two `1px` line gradients in `hsl(var(--border))` on a 64px cell, dropped to `opacity 0.35` and faded
     out by a radial mask.
  3. **Drifting orbs**: three large blurred circles.
      * Top-left: `bg-brand/20`, `blur-[120px]`, `animate-drift-slow`.
      * Right: `bg-brand-2/20`, `blur-[130px]`, `animate-drift-slower`.
      * Bottom-left: `bg-brand/15`, `blur-[120px]`, `animate-drift-slow`.
  4. **Depth vignette**: a radial gradient from transparent at the center to `hsl(var(--background))` near the edges.

## Colors And Tokens

Every layer is token-driven, so the backdrop recolors automatically with the theme. See [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml)
for the `usage.abstract_background` block.

| Layer | Token | Alpha |
| :---: | :---: | :---: |
| Top glow | `--brand` | 0.18 |
| Grid lines | `--border` | layer at 0.35 |
| Orb 1 and 3 | `--brand` | 0.20 and 0.15 |
| Orb 2 | `--brand-2` | 0.20 |
| Vignette | `--background` | solid stop |

## Animations

`drift-slow` (18s) and `drift-slower` (26s) are defined in
[tailwind.config.js](../../packages/config-tailwind/tailwind.config.js). Both translate and scale the orbs gently on an
infinite loop. Each orb adds `motion-reduce:animate-none`, so the backdrop holds still when the user asks for reduced
motion.

## Examples

```tsx
// Default: full-viewport backdrop behind page content.
<div className="relative">
  <AbstractBackground />
  <main className="relative z-10">{children}</main>
</div>
```

```tsx
// Adjust placement or strength through className, never through new colors.
<AbstractBackground className="opacity-80" />
```

## Accessibility

It is `aria-hidden="true"` and `pointer-events-none`, so assistive tech skips it and it never intercepts clicks or focus.
Keep both attributes if you extend it. The reduced-motion handling is part of the contract, not an optional nicety.

## Usage Guidelines

Place it once per screen as the first child of a `relative` or `fixed` container, then layer real content above it with
`z-10`. It already sets `bg-background`, so you do not need a separate background color on the parent.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Drive every layer from theme tokens. | Hardcode hex colors into the gradients or orbs. |
| Keep `aria-hidden` and `pointer-events-none`. | Let it capture pointer events or screen-reader focus. |
| Keep `motion-reduce:animate-none` on each orb. | Ship motion that ignores the reduced-motion preference. |
| Use `className` for placement tweaks. | Use `className` to repaint it off-theme. |

</div>
