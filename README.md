<div align = "center">

# TyPhed Shared Components

[![React](https://img.shields.io/badge/React-%2019-003B57?style=plastic&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-%205-003B57?style=plastic&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-%203.4-003B57?style=plastic&logo=tailwindcss)](https://tailwindcss.com)
[![Consumed As](https://img.shields.io/badge/Consumed-%20git%20submodule-003B57?style=plastic&logo=git)](#-how-to-consume-it)

</div>

<div align = "justify">

The React implementation of the TyPhed brand. Every property mounts this repository as a git submodule at
`shared/components/`, so the header, the footer, the brand mark, and the primitives beneath them are written once and
rendered everywhere.

Its companion is [typhed/shared.documents](https://github.com/typhed/shared.documents), which holds the brand contract
and the design tokens these components render. This repository is the implementation; that one is the source of truth
for what it says and how it looks.

## 📦 What Lives Here

| Package | Name | Holds |
| :---: | :---: | --- |
| [packages/ui](packages/ui) | `@typhed/ui` | Every shared component, from `SiteHeader` and `SiteFooter` to the shadcn-style primitives |
| [packages/config-tailwind](packages/config-tailwind) | `@typhed/tailwind-config` | The Tailwind preset, which reads its theme from `@typhed/brand` and emits both palettes |
| [packages/config-typescript](packages/config-typescript) | `@typhed/tsconfig` | The three tsconfig bases every consumer extends |
| [docs/components](docs/components) | | One reference page per component: props, variants, anatomy, tokens, accessibility |

Nothing here is pre-built. `@typhed/ui` has no `dist` and no build step; each consuming app lists it under
`transpilePackages` and compiles the `.tsx` from source. Editing a component takes effect immediately in a consumer
running `pnpm dev`, with nothing to rebuild in between.

## 🔌 How To Consume It

```shell
$ git submodule add -b master https://github.com/typhed/shared.components.git shared/components
$ git submodule add -b master https://github.com/typhed/shared.documents.git shared/documents
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "shared/components/packages/*"
  - "shared/documents/brand"
```

Then import as though the packages were local:

```tsx
import { SiteHeader } from "@typhed/ui/components/site-header"
import { SiteFooter } from "@typhed/ui/components/site-footer"
import { Button } from "@typhed/ui/components/ui/button"
```

Three things a consuming app must do, and the first is the one people forget:

  1. Add `"../../shared/components/packages/ui/components/**/*.{ts,tsx}"` to its Tailwind `content` globs. Tailwind only
     generates a class it has seen in a scanned file, so without this the components render with their styles silently
     missing and no error appears anywhere.
  2. List `@typhed/ui` and `@typhed/brand` in `transpilePackages`.
  3. Expose the font CSS variables named in
     [typography.json](https://github.com/typhed/shared.documents/blob/master/brand/tokens/typography.json), since the
     preset maps `font-sans` and `font-display` to them.

The full setup is in
[MIGRATION.md](https://github.com/typhed/shared.documents/blob/master/MIGRATION.md).

## 🧱 Where The Boundary Sits

`@typhed/ui` renders on every property, so it stays free of anything that belongs to one of them:

  * **No brand content.** Copy, links, and dates come from `@typhed/brand`, never from a literal in a component.
  * **No colours.** Every colour resolves from a theme token, so both palettes move together.
  * **No auth dependency.** `SiteHeader` takes the sign-in control as a slot (`authSlot`, `mobileAuthSlot`), so each
     property brings its own. A Clerk import in this package would couple every site to one property's auth choice.
  * **No app framework.** React and React DOM are peer dependencies; the consuming app owns the single copy.

If a change is only right for one site, it belongs in that site, or behind a prop with a neutral default.

## 🛠️ Developing

Develop from inside a consuming repository rather than standing this one up alone. `@typhed/ui` depends on
`@typhed/brand`, which lives in the other repository, so the two only resolve together in a consumer workspace:

```shell
$ cd <a consuming repository>
$ pnpm install
$ pnpm dev
```

Edit files under `shared/components/`, and the running dev server picks them up. Commit and push **inside the submodule
directory**, not from the consumer, or the change reaches nothing.

Read the component's page in [docs/components](docs/components) before editing it. The pages record the props, the
accessibility contract, and the do's and don'ts that keep the library on brand, and the code is the truth whenever the
two disagree.

## ⚠️ Blast Radius

A commit here changes every TyPhed property on its next build. Renaming a prop, changing a default, or removing a
component is a breaking change everywhere at once: add the new shape, migrate the consumers, then remove the old one.

</div>
