<div align = "center">

# Button

</div>

<div align = "justify">

`Button` is the shared shadcn-style button primitive. It uses `class-variance-authority` to expose a set of style variants
and sizes, supports rendering as a child element through Radix `Slot`, and merges any extra classes a caller passes.
[ThemeToggle](theme-toggle.md) is its one consumer today, but it is the base for any button the brand needs.

It is a Server Component built with `React.forwardRef`, so it forwards a ref to the underlying element.

## Source And Import

  * **Source**: [packages/ui/components/ui/button.tsx](../../packages/ui/components/ui/button.tsx)
  * **Exports**: `Button` and `buttonVariants`

```tsx
import { Button, buttonVariants } from "@typhed/ui/components/ui/button"
```

## Props

`Button` extends the native `<button>` attributes and adds the variant props plus `asChild`.

| Prop | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style. See the variant table. |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Sizing preset. See the size table. |
| `asChild` | `boolean` | `false` | Render the styles onto the child element via Radix `Slot` instead of a `<button>`. |
| `className` | `string` | `undefined` | Extra classes, merged last so they win over the variant defaults. |
| `...props` | `ButtonHTMLAttributes` | n/a | All native button props (`onClick`, `disabled`, `type`, and so on). |

## Variants

Each variant pairs a fill or treatment with its readable foreground. All colors resolve from theme tokens, so every
variant tracks the active theme.

| Variant | Classes | Use For |
| :---: | --- | --- |
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` | The primary action. |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` | A dangerous or irreversible action. |
| `outline` | `border border-border bg-background hover:bg-accent hover:text-accent-foreground` | A secondary action that needs an edge. |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | A lower-emphasis action. |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | A quiet action with no resting fill. |
| `link` | `text-primary underline-offset-4 hover:underline` | An action that should read as a link. |

## Sizes

| Size | Classes | Use For |
| :---: | --- | --- |
| `default` | `h-10 px-4 py-2` | Most buttons. |
| `sm` | `h-9 rounded-md px-3` | Compact rows and toolbars. |
| `lg` | `h-11 rounded-md px-8` | Prominent calls to action. |
| `icon` | `h-10 w-10` | A square icon-only button. |

The base classes also give every button a focus ring (`focus-visible:ring-2 focus-visible:ring-ring`), disabled handling
(`disabled:pointer-events-none disabled:opacity-50`), and automatic `size-4` sizing for any `svg` child.

## Colors And Tokens

| Token | Where It Shows |
| :---: | --- |
| `--primary` | `default` fill, `link` text |
| `--destructive` | `destructive` fill |
| `--secondary` | `secondary` fill |
| `--accent` | `outline` and `ghost` hover fill |
| `--border` | `outline` border |
| `--ring` | focus ring on every variant |

See [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml) for the values behind each token.

## Examples

```tsx
// Default primary button.
<Button onClick={save}>Save</Button>
```

```tsx
// Icon-only button, the shape ThemeToggle builds on.
<Button variant="default" size="icon" aria-label="Toggle color theme">
  <Sun />
</Button>
```

```tsx
// asChild renders the button styles onto a real anchor for correct link semantics.
<Button asChild variant="link">
  <a href="/docs">Read the docs</a>
</Button>
```

```tsx
// buttonVariants gives the same classes without the component, useful on a link.
<a className={buttonVariants({ variant: "outline", size: "sm" })} href="/x">Open</a>
```

## Accessibility

  * Every variant ships a visible `focus-visible` ring, so keyboard users can see focus. Keep it.
  * `disabled` removes pointer events and dims the button; pair it with real state, not just styling.
  * For an icon-only button, always pass an `aria-label`. The icon alone has no accessible name.
  * With `asChild`, the rendered element decides the semantics. Use a real `<a>` for navigation and a `<button>` for
    actions, so the role matches the behavior.

## Usage Guidelines

Pick the variant by intent: one `default` primary action per view, `outline` or `secondary` for the rest, `ghost` for
quiet controls, and `link` only when it should read as a link. Reach for `asChild` whenever the control is really a link or
another element, rather than nesting an `<a>` inside a `<button>`. Layer one-off styles through `className`, which merges
last and overrides the variant.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Choose a variant that matches the action's intent. | Restyle `default` into something a variant already covers. |
| Use `asChild` for links and custom elements. | Nest an `<a>` inside a `<button>`. |
| Add `aria-label` to icon-only buttons. | Ship an icon button with no accessible name. |
| Keep the `focus-visible` ring. | Remove focus styles for looks. |
| Let `className` override through `cn`. | Fork the file to make a one-off button. |

</div>
