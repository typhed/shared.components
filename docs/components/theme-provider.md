<div align = "center">

# ThemeProvider

</div>

<div align = "justify">

`ThemeProvider` is a thin wrapper around the `next-themes` provider. It exists so apps import the provider from the shared
`@typhed/ui` package instead of depending on `next-themes` directly. It forwards every prop straight through, so the
consumer decides the default theme, the attribute strategy, and the rest.

It is a Client Component (`"use client"`). It carries no logic of its own beyond passing props down.

## Source And Import

  * **Source**: [packages/ui/components/theme-provider.tsx](../../packages/ui/components/theme-provider.tsx)
  * **Wraps**: `ThemeProvider` from `next-themes`
  * **Used by**: `app/layout.tsx`

```tsx
import { ThemeProvider } from "@typhed/ui/components/theme-provider"
```

## Props

It accepts the full prop set of the `next-themes` provider (`React.ComponentProps<typeof NextThemesProvider>`). The props
the app actually sets are below.

| Prop | Type | App value | Description |
| :---: | :---: | :---: | --- |
| `children` | `React.ReactNode` | the app tree | Everything that reads the theme. |
| `attribute` | `string` | `"class"` | Switches theme by toggling the `.dark` class on `<html>`, which the Tailwind tokens rely on. |
| `defaultTheme` | `string` | `"dark"` | Midnight Indigo is the default theme. |
| `enableSystem` | `boolean` | `true` | Lets a first visit follow the OS color preference. |
| `disableTransitionOnChange` | `boolean` | `true` | Skips CSS transitions during a theme switch to avoid a flash. |

Any other `next-themes` prop (`storageKey`, `themes`, `forcedTheme`, and so on) passes through unchanged.

## How It Connects To The Tokens

`attribute="class"` is the link between this provider and the color system. The dark palette in
[brand/tokens/colors.json](https://github.com/typhed/shared.documents/blob/master/brand/tokens/colors.json) is emitted under the `.dark` selector by the shared
Tailwind preset, so the provider toggling that class is what
swaps Midnight Indigo for Aurora Glass. See [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml) for the token tables.

## Examples

```tsx
// As wired in the app root layout.
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

Render it high in the tree, ideally in the root layout, so every component below can read and switch the theme. The
`<html>` element should set `suppressHydrationWarning`, as the app layout does, because `next-themes` updates the class
after hydration.

## Accessibility

The provider has no UI and no direct accessibility surface. It does shape perceived behavior: `enableSystem` honors a
user's OS preference on first visit, which is the accessible default. Keep it on unless there is a strong reason to force a
single theme.

## Usage Guidelines

Use one provider near the root. Set the theme strategy here, not in child components. If you need to read or set the theme
in a component, call `useTheme` from `next-themes` inside a Client Component nested under this provider, the way
[ThemeToggle](theme-toggle.md) does.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Render it once at the app root. | Scatter multiple providers down the tree. |
| Keep `attribute="class"` for the token system. | Switch to an attribute the Tailwind tokens do not read. |
| Set `suppressHydrationWarning` on `<html>`. | Omit it and accept theme-class hydration warnings. |
| Configure the theme strategy here. | Hardcode theme decisions inside leaf components. |

</div>
