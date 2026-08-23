/**
 * The reader's text-size preference, defined once.
 *
 * `FontSizeToggle` (a Client Component) and `SiteHeader` (a Server Component)
 * both need these values, so they live in a plain module with no `"use client"`
 * directive rather than in either component. The storage key and the property
 * names are written into the inline script below from the same constants the
 * toggle reads, so the two can never drift apart.
 *
 * Two custom properties, which is what keeps the control scoped:
 *
 *   `--font-scale-setting`  the visitor's choice, set on `<html>`.
 *   `--font-scale`          what every `text-*` utility multiplies by.
 *
 * The Tailwind preset declares `--font-scale: 1` on `:root` and redefines it to
 * the setting on `main` (and on any `[data-font-scale-scope]` element). Custom
 * properties inherit, so page content picks the choice up and the header,
 * footer, and copyright bar keep the stock size because they sit outside that
 * subtree. Chrome is not a reading surface and does not follow the reader.
 *
 * Only font sizes and `rem` line heights reference the property. No spacing,
 * height, radius, or gap utility does, which is what separates this from
 * browser zoom: the words grow and the layout around them holds still.
 */

/** Where the chosen step is persisted, as an integer written to a string. */
export const FONT_STEP_KEY = "typhed-font-step"

/** Set on `<html>`. Carries the visitor's choice down to the scope. */
export const FONT_SCALE_SETTING_PROPERTY = "--font-scale-setting"

/** Read by every text size. `1` outside the reading scope, the setting inside. */
export const FONT_SCALE_PROPERTY = "--font-scale"

/** The stock root size the whole scale is anchored on. */
export const FONT_BASE_PX = 16

/** One press of the control, in pixels of body copy. */
export const FONT_STEP_PX = 2.5

/** Three steps down and three up, plus the default in the middle. */
export const FONT_STEP_MIN = -3
export const FONT_STEP_MAX = 3

/**
 * Force any input into a whole step inside the supported range. Applied to
 * everything read back from storage as well as to every button press, so a
 * hand-edited value cannot push the page to an unreadable size.
 *
 * @param step a possibly out-of-range or non-integer step
 * @returns an integer between `FONT_STEP_MIN` and `FONT_STEP_MAX`
 */
export function clampFontStep(step: number): number {
  if (!Number.isFinite(step)) return 0
  return Math.min(FONT_STEP_MAX, Math.max(FONT_STEP_MIN, Math.round(step)))
}

/**
 * The multiplier one step maps to.
 *
 * Each step moves body copy by exactly `FONT_STEP_PX`, and the result is
 * expressed as a ratio so the rest of the scale moves with it proportionally.
 * A flat pixel offset applied to every size would leave `text-5xl` almost
 * unchanged while jumping `text-xs` by a fifth, flattening the type hierarchy a
 * little further at each step; a ratio keeps the page looking like itself.
 *
 *     step  -3     -2     -1      0      1      2      3
 *     base  8.5px  11px   13.5px  16px   18.5px 21px   23.5px
 *
 * @param step a step, clamped before use
 * @returns the multiplier for `--font-scale-setting`
 */
export function fontScaleForStep(step: number): number {
  return (FONT_BASE_PX + clampFontStep(step) * FONT_STEP_PX) / FONT_BASE_PX
}

/**
 * Applies the saved preference before the browser paints, the same trick
 * `next-themes` uses for the colour theme. `SiteHeader` inlines it at the top
 * of the header so it runs during HTML parse; without it, a visitor on a
 * non-default size watches the page render at 16px and then reflow.
 *
 * It touches only its own key, clamps what it finds, and fails silently,
 * because private browsing and partitioned storage both throw on access.
 *
 * Kept as ONE template literal on purpose. Splitting it across two joined by
 * `+` reads better at this width, but Next's SWC minifier folds the two and
 * drops the first one's trailing characters on the way, shipping a script that
 * cannot parse. There is no build error and no runtime error - the browser
 * simply ignores it and the preference silently stops applying before paint.
 * If this line ever needs to grow, verify the emitted `<script>` in a
 * production build rather than trusting the source.
 */
export const FONT_SCALE_SCRIPT = `try{var s=Math.round(+localStorage.getItem("${FONT_STEP_KEY}")||0);if(s<${FONT_STEP_MIN})s=${FONT_STEP_MIN};if(s>${FONT_STEP_MAX})s=${FONT_STEP_MAX};if(s)document.documentElement.style.setProperty("${FONT_SCALE_SETTING_PROPERTY}",String((${FONT_BASE_PX}+${FONT_STEP_PX}*s)/${FONT_BASE_PX}))}catch(e){}`
