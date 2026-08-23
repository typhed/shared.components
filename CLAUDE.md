# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What This Repo Is

`typhed/shared.components` is the React implementation of the TyPhed brand. It ships three workspace packages and builds
nothing of its own:

  * `packages/ui` (`@typhed/ui`) - every shared component. No `dist`, no build script; consumers compile the `.tsx` from
    source through `transpilePackages`.
  * `packages/config-tailwind` (`@typhed/tailwind-config`) - the shared preset. It reads colour, spacing, and typography
    values from `@typhed/brand` and emits both theme palettes into the base layer, so no consuming app declares them.
  * `packages/config-typescript` (`@typhed/tsconfig`) - the three tsconfig bases.
  * `docs/components/` - one reference page per component. These live here, next to the code, so a documentation fix
    rides along with the change that caused it.

The brand contract it renders lives in the companion repository,
[typhed/shared.documents](https://github.com/typhed/shared.documents), mounted alongside this one at
`shared/documents/`.

## The Rule That Governs Everything Here

**A commit in this repository changes every TyPhed property.** Renaming a prop, changing a default, or removing a
component breaks every site at once. Add the new shape, migrate the consumers, then remove the old one.

Before editing a component, read its page in `docs/components/`. When the page and the code disagree, the code is the
truth and the page gets fixed.

## What Does Not Belong In A Shared Component

  * **Brand content.** Copy, links, dates, and contact details come from `@typhed/brand`. Never write a literal string
    that names the company, a product, or a URL into a component.
  * **Colour literals.** Every colour resolves from a theme token so both palettes move together. Never paste a hex.
  * **Auth dependencies.** `SiteHeader` takes the sign-in control as a slot (`authSlot`, `mobileAuthSlot`). A Clerk
    import here would couple every property to one site's auth choice. Keep that direction.
  * **Anything true of only one property.** Put it in that property, or behind a prop with a neutral default.

## Working Here

Develop from inside a consuming repository. `@typhed/ui` depends on `@typhed/brand` from the other repository, so the
packages only resolve together in a consumer workspace. Run `pnpm dev` there and edit files under `shared/components/`.

Commit inside this submodule directory, not from the parent repository, and push before expecting the change anywhere
else.

## Conventions

  * **Respect the runtime boundary.** A component carrying `"use client"` needs state, effects, or browser APIs. Do not
    add hooks to a Server Component, and do not drop `"use client"` from a Client one. Each page in `docs/components/`
    records which side its component sits on.
  * **Preserve the accessibility contract** recorded on each page: roles, `aria-*` attributes, labels, and focus styles.
  * **Honour reduced motion.** Animated components respect `motion-reduce` or `useReducedMotion`. Match that for any new
    motion.
  * **Guard hydration.** `ThemeToggle` renders a stable placeholder on the server and fills in the real icon after
    mount. Keep that pattern for anything whose output depends on the browser.
  * **New files are importable, new directories are not.** The export map in `packages/ui/package.json` exposes
    `./components/*` and `./lib/*`. A new directory at the package root needs an entry of its own.
  * `*.md` files follow the `markdown-format` skill; `CLAUDE.md` is the exception and stays plain. Commits follow
    `git-commiter` and need an emoji-prefixed subject.

## Checks

There is no build and no test suite. Typecheck and lint run from a consuming repository as part of its `pnpm typecheck`
and `pnpm lint`, and the consumer's production build is the strongest gate: a mistake in a shared component fails every
property's build.
