<div align = "center">

# BrandLockup

</div>

<div align = "justify">

`BrandLockup` renders the full TyPhed lockup: the mark, the "TyPhed" wordmark, and the "Engineering Tomorrow" tagline, as
the official artwork published in [assets/brand/lockup](https://github.com/typhed/shared.documents/tree/master/assets/brand/lockup) and synced into each app's
`public/brand`. Two theme-specific
files exist because the tagline gradient and the wordmark are tuned per theme, so the component renders both and toggles
between them with the `.dark` class rather than swapping in JavaScript. The correct lockup is therefore visible from first
paint in the static export, with no hydration flash.

It is a Server Component. For the compact header identity (mark plus wordmark, no tagline) use
[BrandMark](brand-mark.md) instead.

## Source And Import

  * **Source**: [packages/ui/components/brand-lockup.tsx](../../packages/ui/components/brand-lockup.tsx)
  * **Assets**: [typhed-lockup-light.svg](https://github.com/typhed/shared.documents/blob/master/assets/brand/lockup/typhed-lockup-light.svg) and
    [typhed-lockup-dark.svg](https://github.com/typhed/shared.documents/blob/master/assets/brand/lockup/typhed-lockup-dark.svg)

```tsx
import { BrandLockup } from "@typhed/ui/components/brand-lockup"
```

## Props

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `className` | `string` | `undefined` | Classes for both lockup images. Use it to size the lockup, for example `w-48`. |
| `lightSrc` | `string` | `/brand/lockup/typhed-lockup-light.svg` | Path to the light-theme lockup asset. |
| `darkSrc` | `string` | `/brand/lockup/typhed-lockup-dark.svg` | Path to the dark-theme lockup asset. |

## Anatomy

The root is an `inline-flex` span holding three children:

  1. **Light lockup**: an `<img>` for `lightSrc`, shown with `block dark:hidden` so it is visible only in the light theme.
  2. **Dark lockup**: an `<img>` for `darkSrc`, shown with `hidden dark:block` so it is visible only in the dark theme.
  3. **Screen-reader label**: an `sr-only` span carrying "TyPhed - Engineering Tomorrow" from `SITE` constants.

Both images are decorative (`alt=""`, `aria-hidden`) because one is always visually hidden; the single `sr-only` label
gives the lockup a stable accessible name regardless of the active theme.

## Colors And Tokens

| Element | Token / Class |
| :---: | :---: |
| Lockup artwork | Baked per-theme gradient inside each SVG asset, not a token |
| Light / dark switch | `block dark:hidden` and `hidden dark:block` (driven by the `.dark` class) |

The lockup files carry their own hardcoded colours because a static asset cannot read CSS variables; see the
`static_assets` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml). Two files exist so each theme gets its tuned tagline gradient
and wordmark. Keep both in the brand colour family on any rebrand.

## Examples

```tsx
// Footer brand block, sized by width.
<BrandLockup className="w-48 sm:w-56" />
```

```tsx
// Point at alternative served assets if the deployment layout differs.
<BrandLockup
  lightSrc="/assets/lockup-light.svg"
  darkSrc="/assets/lockup-dark.svg"
/>
```

## Accessibility

Both lockup images are marked decorative (`aria-hidden`, empty `alt`) so screen readers do not announce the hidden
duplicate; the `sr-only` label supplies one stable accessible name across themes. When placing the lockup inside a link,
label the link as well.

## Usage Guidelines

Use `BrandLockup` where the full brand statement fits, such as the footer brand column. Size it with `className` (prefer a
width utility so the tagline stays legible) rather than a scaling transform. For a compact header slot use
[BrandMark](brand-mark.md). The theme switch is pure CSS on the `.dark` class, so it works in the static export without
client hydration.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Size with a width utility so the tagline stays readable. | Shrink it until "Engineering Tomorrow" is illegible. |
| Keep both light and dark assets in sync on a rebrand. | Update one lockup file and leave the other stale. |
| Rely on the CSS `.dark` toggle for theme switching. | Swap the lockup in JavaScript and reintroduce a flash. |
| Label the wrapping link when you make it clickable. | Depend on the decorative images for a link's name. |

</div>
