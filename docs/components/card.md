<div align = "center">

# Card

</div>

<div align = "justify">

`Card` is the shared shadcn-style card primitive, exported as a small family of parts: `Card`, `CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, and `CardFooter`. Together they build a bordered, rounded surface with a consistent
header, body, and footer rhythm. No current surface renders it, so treat it as a ready primitive for future content
rather than a live component.

Every part is a Server Component built with `React.forwardRef` and forwards its ref to the underlying `div`.

## Source And Import

  * **Source**: [packages/ui/components/ui/card.tsx](../../packages/ui/components/ui/card.tsx)
  * **Exports**: `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent`

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@typhed/ui/components/ui/card"
```

## Props

Every part takes the standard `div` attributes plus `className`. None adds custom props; they are styled wrappers.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `className` | `string` | `undefined` | Extra classes, merged with the part's base styles via `cn`. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | n/a | Any native div attribute, plus the forwarded `ref`. |

## Parts

Compose the parts in this order inside a `Card`. Each is optional; use the ones the content needs.

| Part | Base Classes | Role |
| :---: | --- | --- |
| `Card` | `rounded-lg border border-border bg-card text-card-foreground shadow-sm` | The outer surface. |
| `CardHeader` | `flex flex-col space-y-1.5 p-6` | Header block, usually title plus description. |
| `CardTitle` | `text-2xl font-semibold leading-none tracking-tight` | The card heading. |
| `CardDescription` | `text-sm text-muted-foreground` | The supporting subline. |
| `CardContent` | `p-6 pt-0` | The main body. |
| `CardFooter` | `flex items-center p-6 pt-0` | Footer actions or metadata. |

## Colors And Tokens

| Token | Where It Shows |
| :---: | --- |
| `--card` | card fill (`bg-card`) |
| `--card-foreground` | default text color |
| `--border` | card border |
| `--muted-foreground` | `CardDescription` text |

See [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml) for the values. Other surfaces may use the `card` token directly (for example
`bg-card/40` for a glass look) rather than this `Card` component; they share the token, not the markup.

## Examples

```tsx
<Card>
  <CardHeader>
    <CardTitle>Launch update</CardTitle>
    <CardDescription>What changed this week</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Body content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Read more</Button>
  </CardFooter>
</Card>
```

```tsx
// Parts are optional. A bare card with only content is valid.
<Card>
  <CardContent className="pt-6">Minimal card.</CardContent>
</Card>
```

## Accessibility

`CardTitle` renders a `div`, not a heading element, so it carries no heading semantics on its own. When a card title should
join the document outline, pass real heading markup or attributes, for example `<CardTitle asChild>` patterns or an
explicit `role` and `aria-level`. Keep the contrast between `bg-card` and `text-card-foreground` intact for readable body
text.

## Usage Guidelines

Compose the parts rather than rebuilding a card by hand, so spacing and borders stay consistent. Note the padding contract:
`CardContent` and `CardFooter` use `pt-0` on the assumption that a `CardHeader` sits above them. If you skip the header, add
top padding back, as the minimal example does with `pt-6`. Adjust spacing through `className`, which merges last.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Compose the provided parts. | Rebuild a card surface from raw divs. |
| Add `pt-*` back when you omit `CardHeader`. | Leave content flush to the top edge by accident. |
| Give the title heading semantics when it belongs in the outline. | Assume `CardTitle` is a heading for screen readers. |
| Keep `bg-card` with `text-card-foreground`. | Mix card fill with an off-token text color. |

</div>
