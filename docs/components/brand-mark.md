<div align = "center">

# BrandMark

</div>

<div align = "justify">

`BrandMark` is the TyPhed identity: the official brand mark paired with the "TyPhed" wordmark. The mark is the gradient
glyph published as artwork in [assets/brand/mark](https://github.com/typhed/shared.documents/tree/master/assets/brand/mark) and synced into each app's `public/brand`;
it is a full-colour SVG that
reads on both themes, so a single file serves light and dark. The wordmark uses the display font set by the app theme.

It is a Server Component. The mark is rendered as an `<img>` that references the canonical asset rather than being
inlined, so the logo artwork lives in exactly one place and is never re-drawn by hand. For the full lockup (mark plus
wordmark plus tagline) use [BrandLockup](brand-lockup.md) instead.

## Source And Import

  * **Source**: [packages/ui/components/brand-mark.tsx](../../packages/ui/components/brand-mark.tsx)
  * **Asset**: [assets/brand/mark/typhed-mark.svg](https://github.com/typhed/shared.documents/blob/master/assets/brand/mark/typhed-mark.svg)

```tsx
import { BrandMark } from "@typhed/ui/components/brand-mark"
```

## Props

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `showWordmark` | `boolean` | `true` | Render the "TyPhed" wordmark next to the mark. Set `false` for a mark-only logo. |
| `className` | `string` | `undefined` | Classes for the outer `inline-flex` wrapper. Use it for sizing and spacing. |
| `glyphClassName` | `string` | `undefined` | Classes for the mark `img` only. Defaults to `h-9 w-9`; override to resize the mark. |
| `markSrc` | `string` | `/brand/mark/typhed-mark.svg` | Path to the mark asset. Override to point at a different served location. |

## Anatomy

The root is an `inline-flex items-center gap-3` span.

  1. **Mark**: an `<img>` referencing `markSrc` with an `alt` of "TyPhed logo", sized `h-9 w-9 object-contain` by default.
     The artwork is the shipped brand mark, so its colours are baked into the file, not read from theme tokens.
  2. **Wordmark** (when `showWordmark` is true): a `font-display` span reading "Ty" in `text-foreground` and "Phed" in
     `text-brand`.

## Colors And Tokens

| Element | Token / Class |
| :---: | :---: |
| Mark artwork | Baked brand gradient inside the SVG asset (cyan to indigo family), not a token |
| Wordmark "Ty" | `text-foreground` |
| Wordmark "Phed" | `text-brand` |

The mark file carries its own hardcoded brand gradient because a static asset cannot read CSS variables; see the
`static_assets` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml). Only the wordmark tracks the theme through tokens. Keep the
mark artwork and the token palette in the same colour family on any rebrand.

## Examples

```tsx
// Default: mark plus wordmark, used in the header.
<a href="/" aria-label="TyPhed home">
  <BrandMark />
</a>
```

```tsx
// Mark only, resized for a compact slot.
<BrandMark showWordmark={false} glyphClassName="h-6 w-6" />
```

## Accessibility

The mark is a labelled image (`alt="TyPhed logo"`), so it announces as the logo even when the wordmark is hidden. When you
place it inside a link, label the link too, as the header does with `aria-label`. The wordmark is real text, which also
helps search relevance for the brand name.

## Usage Guidelines

Use `BrandMark` for the compact brand identity wherever a mark plus wordmark fits, such as the header. Resize through
`glyphClassName` and `className` rather than scaling transforms, so the artwork stays crisp. For the full lockup with the
tagline use [BrandLockup](brand-lockup.md). For a favicon, use the shipped favicon set wired in
`app/layout.tsx`; for the OG image use the raster generator in
`app/`. This component is for in-app rendering.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Resize with `glyphClassName` / `className`. | Wrap it in a `scale-*` transform that blurs the artwork. |
| Point `markSrc` at a served brand asset. | Inline or re-draw the mark by hand. |
| Label the wrapping link when you make it clickable. | Rely on the mark alone for a link's accessible name. |
| Keep the mark artwork in the brand colour family. | Recolor the shipped asset out of sync with the tokens. |

</div>
