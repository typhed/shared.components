<div align = "center">

# ScrollToTop

</div>

<div align = "justify">

`ScrollToTop` is a "Back to top" button fixed at the bottom-center of the viewport. It stays hidden when the visitor is near the top of the page and fades in once they have scrolled down past 400 pixels. Clicking it smoothly scrolls the page back to the top. The chevron icon lifts slightly on hover. It is kept out of the tab order and the accessibility tree while hidden.

It is a Client Component (uses `useEffect` to track scroll position and `window.scrollTo` to animate). It takes no props and is mounted globally once in the app layout, inside `ThemeProvider`, after the shell.

## Source And Import

  * **Source**: [packages/ui/components/scroll-to-top.tsx](../../packages/ui/components/scroll-to-top.tsx)

```tsx
import { ScrollToTop } from "@typhed/ui/components/scroll-to-top"
```

## Props

None. This component takes no configuration.

## Anatomy

The root is a `<button>` fixed at the bottom-center of the viewport:

  * **Positioning**: `fixed bottom-6 left-1/2 -translate-x-1/2 z-40` (horizontal center, 1.5rem from viewport bottom, floats above most content).
  * **Shape**: `h-10 w-10 rounded-full` (a 40x40 circular button).
  * **Surface**: `border border-border bg-background/70 backdrop-blur-md` (translucent frosted glass surface with a subtle border).
  * **Icon**: a lucide `ChevronUp` sized `h-5 w-5`, centered inside the button. On hover, the chevron lifts upward with `group-hover:-translate-y-0.5`.
  * **Visibility**: controlled by scroll position. Near the top (scrollY <= 400), `pointer-events-none opacity-0` (invisible and non-interactive). Below that, `opacity-100` (visible and clickable).
  * **Interaction**: on click, calls `window.scrollTo({ top: 0, behavior: "smooth" })` to scroll smoothly to the top. On hover, the button moves up with `hover:-translate-y-1`, the border brightens to `hover:border-brand/50`, and the icon color shifts to `hover:text-brand`.
  * **Focus**: keyboard-visible focus ring via `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

## Colors And Tokens

See the `usage.scroll_to_top` block in [colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml).

| Element | Token / Class |
| :---: | :---: |
| Border (resting) | `border-border` |
| Background (resting) | `bg-background/70` |
| Icon color (resting) | `text-muted-foreground` |
| Border (hover) | `hover:border-brand/50` |
| Icon color (hover) | `hover:text-brand` |
| Focus ring | `ring-ring` |

The translucent background and backdrop blur ensure readability over any page content behind the button, and the frosted glass surface tracks both themes automatically through tokens.

## Examples

```tsx
// Mount it globally once in the app layout, inside ThemeProvider.
// apps/web/app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  <SiteHeader />
  <main>{children}</main>
  <SiteFooter />
  <ScrollToTop />
</ThemeProvider>
```

## Accessibility

  * The button carries `aria-label="Back to top"` and `title="Back to top"` so screen readers announce its purpose.
  * While hidden (scrollY <= 400), the button is marked `aria-hidden={!visible}` and `tabIndex={visible ? 0 : -1}`, keeping it out of the a11y tree and tab order until it appears. Keyboard users cannot tab to it until the page is scrolled down.
  * Once visible (scrollY > 400), it becomes focusable and is reachable via keyboard navigation.
  * The focus ring is bright and contrasting (`ring-ring`, which mirrors the brand accent in both themes) so keyboard users can see where focus lands.

## Usage Guidelines

Mount `ScrollToTop` once at the root level, after the main content, so it is the last focusable element in the DOM. It manages its own visibility based on scroll position, so no prop control is needed. The chevron lifts on hover and the button moves up, giving clear tactile feedback. The frosted glass surface blends naturally over any background.

The scroll threshold is hard-coded to 400 pixels (`window.scrollY > 400`); to adjust when the button appears, edit the constant inside the component.

## Do's And Don'ts

| Do | Don't |
| --- | --- |
| Mount it at the root level, after the main content. | Wrap it in a nav or place it inside a modal. |
| Let scroll state drive visibility automatically. | Manually toggle visibility with props. |
| Keep the frosted glass surface and blur effect. | Replace it with a solid opaque background. |
| Use the brand accent tokens on hover. | Hardcode a hover color. |
| Preserve the keyboard focus behavior (hidden when near top). | Make it permanently focusable. |
| Allow smooth scroll animation on click. | Change to instant/jump scroll. |

</div>
