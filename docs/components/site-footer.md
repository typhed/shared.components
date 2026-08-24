<div align = "center">

# SiteFooter

</div>

<div align = "justify">

`SiteFooter` is the site footer. On large screens it is a five column row, each column a fifth of the container: the
brand lockup, two columns of navigation (PRODUCTS, RESOURCES), a legal column stacking DISCLAIMER over COMMUNITY, and a
Contact column with an email link and a social icon row. Beneath them sits a bottom bar carrying the copyright, legal
entity text, and privacy policy link. The legal entity name ("Debmalya Pramanik HUF") stays as visible text so it
contributes to search relevance.

The footer is where the brand layer hands a visitor off to a product. Links that leave `typhed.com` (a product subdomain,
the blog, the LinkedIn career page) are marked `external` in constants, open in a new tab, and carry a trailing arrow
glyph so the visitor sees the jump coming.

It is a Server Component. The columns, copy, and social links come from
[@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts), and the colors are pure theme tokens (a faint brand wash over the
card surface) so the footer recolors with both light and dark themes automatically.

## Source And Import

  * **Source**: [packages/ui/components/site-footer.tsx](../../packages/ui/components/site-footer.tsx)
  * **Data**: `CONTACT_EMAIL`, `COPYRIGHT`, `FOOTER_COLUMN_GROUPS`, `PRIVACY_LINK`, and `SOCIAL_LINKS` from
    [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts)
  * **Depends on**: [BrandLockup](brand-lockup.md)

```tsx
import { SiteFooter } from "@typhed/ui/components/site-footer"
```

## Props

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `className` | `string` | `undefined` | Classes merged onto the `<footer>` root. |

## Anatomy

The root is a `<footer>` with a top border and a faint brand-washed surface. It contains two main blocks:

**Top block** (the multi-column grid, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`):

  1. **Brand column** (`sm:col-span-2 lg:col-span-1`): [BrandLockup](brand-lockup.md) alone (the official mark plus
     wordmark plus "Engineering Tomorrow" tagline, sized `w-48 sm:w-56 lg:w-40 xl:w-48 2xl:w-56` and theme-matched via
     the `.dark` class). The artwork steps down at `lg`, where a fifth of the container is narrower than it, and grows
     back at `xl` and `2xl`. The column is `flex items-center`, so the lockup sits on the vertical centre of the taller
     nav columns. It carries no link list of its own.
  2. **Three link columns** (PRODUCTS, RESOURCES, and DISCLAIMER over COMMUNITY): one column per entry in
     `FOOTER_COLUMN_GROUPS`. Each entry is an array of link groups, so a column renders either one group or two stacked
     (`flex flex-col gap-8`) - which is how five equal columns carry six blocks of content. Every group is a heading
     (`<h2>`) over a `<nav>` list of links. Links are quiet at rest (`text-muted-foreground`) and brighten on hover
     (`hover:text-brand`). An external link gets `target="_blank"`, `rel="noopener noreferrer"`, a trailing
     `ArrowUpRight` glyph (`h-3.5 w-3.5`, `aria-hidden`), and an `sr-only` "(opens in a new tab)" note.
  3. **Contact column**: a heading ("Contact Us"), a `mailto:` link to `CONTACT_EMAIL` (styled as nav links), and below
     it a "Social Connect" subheading with a social icon row.

The `lg:grid-cols-5` track count is what gives every column its fifth of the container, and no column carries a span of
its own - the brand column only resets the `sm:col-span-2` it needs on the two column layout. Below `lg` the grid falls
back to two columns and then to one, so the five column row is a large-screen rule only.

**Social icon row**:

  * Nested under a "Social Connect" heading (`<h3 class="text-sm font-semibold text-foreground">Social Connect</h3>`),
    which sits in a `<div class="mt-6">` below the email text link.
  * A `<nav aria-label="Social media">` of circular icon buttons, driven by `SOCIAL_LINKS` from constants (excluding the
    `mail` entry, which is shown as a text link above). Today that renders GitHub and LinkedIn.
  * Each icon button: `h-9 w-9 rounded-full` with `border-border`, `bg-background/40`, and `text-muted-foreground` at
    rest; on hover: `border-brand/50` and `text-brand`.
  * Supported icon names: `github`, `linkedin`, `twitter`, `instagram`, `youtube`, `facebook`. To add a network, add an
    entry to `SOCIAL_LINKS` with one of these names - no component code change is needed.

**Bottom bar**:

  * Left: `COPYRIGHT.line1` (the year-stamped copyright, muted) stacked above `COPYRIGHT.line2` (the legal entity,
    muted).
  * Right: the privacy policy link (`PRIVACY_LINK`), same muted-to-brand hover as the nav links.
  * Responsive: column on small screens, row on medium and above.

## Colors And Tokens

See the `usage.footer_surface` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml).

| Element | Token / Class |
| :---: | :---: |
| Root background | `bg-card` with gradient `from-brand/5 to-brand-2/5` (a faint on-brand wash) |
| Top border | `border-border` |
| Bottom bar border | `border-border` |
| Column headings | `text-foreground` (emphasized) |
| Link text (resting) | `text-muted-foreground` |
| Link text (hover) | `hover:text-brand` |
| External link arrow | none of its own; the glyph is `currentColor` and tracks the link text |
| Brand lockup | Baked per-theme artwork (mark, wordmark, tagline); see [BrandLockup](brand-lockup.md) |
| Copyright text | `text-muted-foreground` |
| Social icon button border (resting) | `border-border` |
| Social icon button background (resting) | `bg-background/40` |
| Social icon button icon (resting) | `text-muted-foreground` |
| Social icon button border (hover) | `border-brand/50` |
| Social icon button icon (hover) | `hover:text-brand` |

The gradient layers a subtle brand tint over the card surface without obscuring readability, and tracks both themes
automatically through tokens. No hardcoded hex is used.

## Examples

```tsx
// Typical usage at the bottom of the page.
<SiteFooter />
```

```json
// Edit the footer columns in the brand contract, not the component.
// "external": true is what opens a new tab and adds the trailing arrow.
// An href starting with "/" is a page the brand layer hosts; @typhed/brand
// expands it to a full https://typhed.com/... URL before this component runs.
// shared.documents/brand/navigation.json
{
  "footer": {
    "products": {
      "heading": "PRODUCTS",
      "links": [
        { "label": "TyPhed Trading", "href": "https://trading.typhed.com/", "external": true },
        { "label": "Products Pricing", "href": "#" }
      ]
    },
    "disclaimer": {
      "heading": "DISCLAIMER",
      "links": [{ "label": "Legal Disclaimer", "href": "#" }]
    },
    "community": {
      "heading": "COMMUNITY",
      "links": [
        { "label": "Code of Conduct", "href": "/permalink/conduct.html" },
        { "label": "Contributing Guidelines", "href": "#" }
      ]
    }
  },
  "contactEmail": "pramanik.huf@gmail.com",
  "privacy": { "label": "Privacy Policy", "href": "#" }
}
```

The DISCLAIMER column renders Privacy Policy first even though `disclaimer.links` does not list it: `brand/index.ts`
prepends `PRIVACY_LINK` to that column, so the column entry and the bottom bar link can never point at different pages.
Repoint `privacy` and both move together.

Every `href` in that JSON is written from the brand site's point of view, so `/permalink/conduct.html` is the path that
page has on `typhed.com`. What the footer receives is the full URL, because `brand/index.ts` expands each one against
the canonical site URL first. That is what keeps the column working when this same footer renders on
`blog.typhed.com` or `trading.typhed.com`, where a root-relative path would resolve against the wrong host. A full URL,
a `mailto:`, and the `#` placeholder pass through untouched.

The change reaches every TyPhed property on its next build. Nothing in this repository, and nothing in any
consuming app, needs editing to add or repoint a footer link.

## Accessibility

  * Each link group has a `<nav>` with an `aria-label` matching its heading, so screen readers announce the section
    purpose. A column holding two groups (DISCLAIMER over COMMUNITY) exposes two separately labelled landmarks.
  * The social icon row has `aria-label="Social media"` to label the group.
  * Each social icon button carries `aria-label` and `title` matching its network name, so screen readers announce the
    link.
  * The external link arrow is decorative (`aria-hidden="true"`). What it signals visually is given to screen readers as
    `sr-only` text, "(opens in a new tab)", so a new tab is never a surprise.
  * The brand lockup inside the footer is not wrapped in a link; it is a visual marker of context (already at the
    bottom). Its two images are decorative, with a single `sr-only` label; see [BrandLockup](brand-lockup.md).
  * All links are real text, readable by screen readers and searchable by engines.
  * The legal entity name is visible text in the copyright bar, not an image.
  * External links use `rel="noopener noreferrer"`, a security and privacy safeguard.

## Usage Guidelines

The three middle columns come from `FOOTER_COLUMN_GROUPS` (PRODUCTS, RESOURCES, and DISCLAIMER over COMMUNITY), the
contact email from `CONTACT_EMAIL`, and the social icons from `SOCIAL_LINKS` in constants. Add links by editing the
arrays behind `FOOTER_COLUMN_GROUPS`, and set `external: true` on anything that leaves `typhed.com` so it opens in a new
tab and shows the arrow. Do not edit the footer component to add a link. Adding a *column* is a layout change and does
need one: five columns is what the container width carries, so a sixth block of content stacks inside an existing column
rather than claiming a track of its own. To add a social network, append an entry to `SOCIAL_LINKS` with a
supported icon name; the footer renders it automatically. The `mail` entry in `SOCIAL_LINKS` is always excluded from the
icon row (shown as a text link instead). The brand column holds the lockup and nothing else: it is the visual anchor of
the row, not a link list. Keep the legal entity line as visible text in the copyright bar. The copyright year updates
automatically through JavaScript (`new Date().getFullYear()`), so no annual maintenance is needed.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Add links via the arrays behind `FOOTER_COLUMN_GROUPS` in constants. | Hardcode column links into the footer. |
| Mark off-site destinations with `external: true`. | Send a footer link off-site without it, losing the new tab and the arrow. |
| Keep the brand column to the lockup alone. | Reintroduce a link stack under the lockup. |
| Add social networks via `SOCIAL_LINKS` in constants. | Hardcode social links or icon buttons. |
| Drive the email from `CONTACT_EMAIL`. | Paste an email address into the component. |
| Keep the legal entity as visible text in the copyright bar. | Replace it with a logo or hide it. |
| Use one of the supported icon names (github, linkedin, twitter, instagram, youtube, facebook). | Invent new icon names. |
| Keep `rel="noopener noreferrer"` on external links. | Open external links without the safe `rel`. |
| Hold the five equal columns by editing `lg:grid-cols-5`. | Swap in arbitrary percentage widths or per column spans. |
| Let a column stack two groups when content outgrows five tracks. | Add a sixth grid column and squeeze every one of them. |
| Repoint the privacy policy once, in `privacy`. | List Privacy Policy again under `disclaimer` and let the two drift. |
| Use the subtle brand gradient over `bg-card`. | Add a dark, opaque background. |

</div>
