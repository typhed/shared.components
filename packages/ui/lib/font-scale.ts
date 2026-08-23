/**
 * The text-size preference, defined once.
 *
 * `FontSizeToggle` (a Client Component) and `SiteHeader` (a Server Component)
 * both need these values, so they live in a plain module with no `"use client"`
 * directive rather than in either component. The storage key and the property
 * name are written into the inline script below from the same constants the
 * toggle reads, so the two can never drift apart.
 *
 * The scale itself is applied by the Tailwind preset in
 * `packages/config-tailwind/tailwind.config.js`, which multiplies every
 * `text-*` size and `rem` line height by `--font-scale` and nothing else. That
 * is what separates this from browser zoom: type grows, and the spacing,
 * heights, and gaps around it hold still.
 */

/** Where the chosen scale is persisted, as a bare number written to a string. */
export const FONT_SCALE_KEY = "typhed-font-scale"

/** The custom property the preset multiplies every font size by. */
export const FONT_SCALE_PROPERTY = "--font-scale"

/** The default: stock Tailwind sizes on a 16px root. */
export const FONT_SCALE_NORMAL = 1

/** The larger step. 1.25 lifts body copy from 16px to 20px. */
export const FONT_SCALE_LARGE = 1.25

/**
 * Applies the saved preference before the browser paints, the same trick
 * `next-themes` uses for the colour theme. `SiteHeader` inlines it at the top
 * of the header so it runs during HTML parse; without it, a visitor on the
 * larger setting watches the page render at the default size and then reflow.
 *
 * It touches only its own key and fails silently, because private browsing and
 * partitioned storage both throw on access.
 *
 * Kept as ONE template literal on purpose. Splitting it across two joined by
 * `+` reads better at this width, but Next's SWC minifier folds the two and
 * drops the first one's trailing `");` on the way, shipping a script that
 * cannot parse. There is no build error and no runtime error — the browser
 * simply ignores it and the preference silently stops applying before paint.
 * If this line ever needs to grow, verify the emitted `<script>` in a
 * production build rather than trusting the source.
 */
export const FONT_SCALE_SCRIPT = `try{var v=localStorage.getItem("${FONT_SCALE_KEY}");if(v)document.documentElement.style.setProperty("${FONT_SCALE_PROPERTY}",v)}catch(e){}`
