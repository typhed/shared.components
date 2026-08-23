<div align = "center">

# TyPhed Component Library

[![React](https://img.shields.io/badge/React-%2019-003B57?style=plastic&logo=react)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-%2015-003B57?style=plastic&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-%205-003B57?style=plastic&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-%203.4-003B57?style=plastic&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-%2011-003B57?style=plastic&logo=framer)](https://www.framer.com/motion/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-%20primitives-003B57?style=plastic&logo=shadcnui)](https://ui.shadcn.com)

</div>

<div align = "justify">

This folder is the reference manual for every shared UI component across the TyPhed properties. The components live in
[packages/ui/components](../../packages/ui/components) and ship through the `@typhed/ui` workspace package. Each component
has its own page below that records its props, variants, anatomy, color tokens, examples, accessibility contract, and the
do's and don'ts that keep the UI on brand.

Treat these pages as the source of truth before you touch a component. Read the relevant page and
[docs/design/colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml) first, then change the code. Color values never live in component files
directly; they resolve from theme tokens, so a color edit almost always belongs in `globals.css`, not here.

## 🧩 Component Index

The library splits into two groups: the branded surface pieces and the shadcn-style primitives. "Type" marks whether a
component runs as a React Server Component or ships a client bundle (`"use client"`).

| Component | Source | Type | Documentation |
| :---: | --- | :---: | :---: |
| AbstractBackground | [abstract-background.tsx](../../packages/ui/components/abstract-background.tsx) | Server | [abstract-background.md](abstract-background.md) |
| BrandMark | [brand-mark.tsx](../../packages/ui/components/brand-mark.tsx) | Server | [brand-mark.md](brand-mark.md) |
| BrandLockup | [brand-lockup.tsx](../../packages/ui/components/brand-lockup.tsx) | Server | [brand-lockup.md](brand-lockup.md) |
| SiteHeader | [site-header.tsx](../../packages/ui/components/site-header.tsx) | Server | [site-header.md](site-header.md) |
| SiteFooter | [site-footer.tsx](../../packages/ui/components/site-footer.tsx) | Server | [site-footer.md](site-footer.md) |
| ScrollToTop | [scroll-to-top.tsx](../../packages/ui/components/scroll-to-top.tsx) | Client | [scroll-to-top.md](scroll-to-top.md) |
| ThemeToggle | [theme-toggle.tsx](../../packages/ui/components/theme-toggle.tsx) | Client | [theme-toggle.md](theme-toggle.md) |
| ThemeProvider | [theme-provider.tsx](../../packages/ui/components/theme-provider.tsx) | Client | [theme-provider.md](theme-provider.md) |
| Button | [ui/button.tsx](../../packages/ui/components/ui/button.tsx) | Server | [button.md](button.md) |
| Card | [ui/card.tsx](../../packages/ui/components/ui/card.tsx) | Server | [card.md](card.md) |

Today only [ThemeToggle](theme-toggle.md) renders Button, and no surface renders Card yet. Both stay documented as ready
primitives for the components the final product will build.

## 🎨 Design Tokens

Every color flows through the theme tokens defined in [docs/design/colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml). Components reference
them through Tailwind classes such as `bg-brand`, `text-foreground`, and `border-border`, never through raw hex. The two
themes are Midnight Indigo (dark, the default) and Aurora Glass (light), and the accent hue swaps between them: cyan leads
in dark, indigo leads in light. When a component page lists "Colors And Tokens", each entry maps to a row in that file.

## 🧱 Architecture

  * **Package**: all components export from `@typhed/ui`. The package map in
    [packages/ui/package.json](../../packages/ui/package.json) exposes `./components/*` and `./lib/*`.
  * **Import paths**: `import { BrandMark } from "@typhed/ui/components/brand-mark"`. Primitives sit one level deeper, for
    example `@typhed/ui/components/ui/button`.
  * **Class merging**: styled components accept a `className` and fold it in with `cn` from
    [lib/utils.ts](../../packages/ui/lib/utils.ts). `cn` runs `clsx` then `tailwind-merge`, so a caller's class wins over
    the component default when the two conflict.
  * **Shared copy and dates**: brand strings, the launch target, and contact links come from
    [@typhed/brand](https://github.com/typhed/shared.documents/blob/master/brand/index.ts). Components read from there rather than hardcoding text.
  * **Fonts**: `font-display` is Space Grotesk and `font-sans` is Inter, both wired in
    `app/layout.tsx`.

## 🤖 Notes For LLM Agents

Read this before changing any component.

  * Read the component's page and [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml) before editing. Do not infer behavior from the name.
  * Keep colors in tokens. Never paste a hex value into a component; edit the HSL triplet in
    [brand/tokens/colors.json](https://github.com/typhed/shared.documents/blob/master/brand/tokens/colors.json) instead, and every TyPhed property picks it up.
  * Respect the runtime boundary. A component marked Client carries `"use client"` for a reason (state, effects, or
    browser APIs). Do not add hooks to a Server component, and do not drop `"use client"` from a Client one.
  * Guard hydration. ThemeToggle renders a stable placeholder on the server and fills in the real icon after mount. Keep
    that pattern for any component whose output depends on the browser.
  * Honor reduced motion. Animated components already respect `motion-reduce` or `useReducedMotion`. Match that for any new
    motion.
  * Preserve the accessibility contract listed on each page: roles, `aria-*` attributes, labels, and focus styles.

## 📐 Page Conventions

Each component page follows the same order so you can scan it fast.

  1. A one-line summary and where it renders.
  2. **Source And Import** with the exact import path.
  3. **Props** as a table of name, type, default, and description.
  4. **Variants** where the component defines them.
  5. **Anatomy** describing the rendered structure.
  6. **Colors And Tokens** linking back to the color reference.
  7. **Examples** as runnable `tsx` snippets.
  8. **Accessibility** with the concrete contract.
  9. **Usage Guidelines** and a **Do's And Don'ts** table.

</div>
