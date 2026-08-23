const animate = require("tailwindcss-animate")

const spacingTokens = require("@typhed/brand/tokens/spacing.json")
const typographyTokens = require("@typhed/brand/tokens/typography.json")

/**
 * The multiplier every font size in this preset is expressed against. It is
 * `1` everywhere by default and is redefined to the reader's setting on the
 * reading scope below, so only page content follows the control. The `, 1`
 * fallback means a page that never sets it renders at the stock Tailwind size.
 */
const SCALE = "var(--font-scale, 1)"

/**
 * Where the reader's text-size choice applies. `main` is the semantic content
 * region every TyPhed layout already wraps its page in; the attribute is the
 * escape hatch for a surface that needs the same treatment without being a
 * `main`. Everything outside this selector - the header, the footer, the
 * copyright bar - keeps `--font-scale: 1` from `:root` and never moves.
 */
const READING_SCOPE = "main, [data-font-scale-scope]"

/**
 * One entry of the type scale, expressed as a multiple of `--font-scale`.
 *
 * Only the font size and a `rem` line height are multiplied. Unitless line
 * heights (`5xl` and up) are already relative to the font size and so scale on
 * their own, as does every `em` value such as `tracking-tight`. Nothing in the
 * spacing scale references the property, which is the entire point: text grows
 * and the layout around it holds still.
 *
 * @param {string} size a `rem` font size from the stock Tailwind scale
 * @param {string} lineHeight a `rem` line height, or a unitless ratio
 * @returns {[string, { lineHeight: string }]} a Tailwind fontSize entry
 */
function scaled(size, lineHeight) {
  return [
    `calc(${size} * ${SCALE})`,
    {
      lineHeight: lineHeight.endsWith("rem")
        ? `calc(${lineHeight} * ${SCALE})`
        : lineHeight,
    },
  ]
}

/**
 * Shared Tailwind preset for every TyPhed app and package.
 *
 * Apps extend it with `presets: [sharedConfig]` and supply their own `content`
 * globs; the preset ships an empty `content` array on purpose. The container,
 * radius, and font stacks are read from `@typhed/brand`, so they change in one
 * JSON file for every property at once.
 *
 * The colour utilities below map to CSS custom properties but do NOT define
 * them. The palette is generated into a stylesheet by
 * `shared/documents/scripts/sync-shared.mjs`, which each app imports, because a
 * bundler tracks CSS files and rebuilds when they change but does not track
 * JSON required by this config. An app that skips that step gets no colours at
 * all, which is the loud failure the arrangement is designed for.
 *
 * `--font-scale` is the one thing this preset does emit from a plugin, and the
 * reasoning above does not apply to it: the defaults are static literals
 * written in this file, not values read from JSON, and Tailwind watches its own
 * config. It exists so the header's text-size control can grow type without
 * growing anything else. Every `text-*` utility multiplies by it; no spacing,
 * height, radius, or gap utility ever does.
 *
 * The control is scoped by inheritance rather than by opting surfaces out. The
 * property resolves to `1` at `:root` and is redefined to the reader's setting
 * on `READING_SCOPE`, so page content inherits the choice and chrome outside
 * that subtree keeps the stock size. Nothing in a component has to know it is
 * in the header to be excluded.
 *
 * The one sharp edge: an arbitrary size such as `text-[0.625rem]` bypasses the
 * scale entirely. That is the right default, because opting out stays trivial,
 * but an arbitrary size that SHOULD follow the control has to say so, as
 * `countdown-timer.tsx` and `wip-landing.tsx` both do:
 *
 *     text-[calc(0.625rem*var(--font-scale,1))]
 *
 * @type {import("tailwindcss").Config}
 */
module.exports = {
  darkMode: ["class"],
  content: [],
  theme: {
    container: spacingTokens.container,
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
        "brand-2": {
          DEFAULT: "hsl(var(--brand-2))",
        },
      },
      borderRadius: spacingTokens.radius.scale,
      fontFamily: typographyTokens.fontFamily,
      // Stock Tailwind values, restated so each one can be multiplied by
      // `--font-scale`. At the default scale of 1 this renders identically to
      // the built-in scale it replaces.
      fontSize: {
        xs: scaled("0.75rem", "1rem"),
        sm: scaled("0.875rem", "1.25rem"),
        base: scaled("1rem", "1.5rem"),
        lg: scaled("1.125rem", "1.75rem"),
        xl: scaled("1.25rem", "1.75rem"),
        "2xl": scaled("1.5rem", "2rem"),
        "3xl": scaled("1.875rem", "2.25rem"),
        "4xl": scaled("2.25rem", "2.5rem"),
        "5xl": scaled("3rem", "1"),
        "6xl": scaled("3.75rem", "1"),
        "7xl": scaled("4.5rem", "1"),
        "8xl": scaled("6rem", "1"),
        "9xl": scaled("8rem", "1"),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(4%, -6%, 0) scale(1.08)" },
        },
        "drift-slower": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1.05)" },
          "50%": { transform: "translate3d(-5%, 5%, 0) scale(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.6", transform: "scale(0.95)" },
          "50%": { opacity: "0.25", transform: "scale(1.05)" },
          "100%": { opacity: "0.6", transform: "scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "drift-slow": "drift-slow 18s ease-in-out infinite",
        "drift-slower": "drift-slower 26s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 6s linear infinite",
        "pulse-ring": "pulse-ring 4s ease-in-out infinite",
      },
    },
  },
  plugins: [
    animate,
    // Declares both defaults so the pair is visible in devtools, then opens the
    // reading scope. The `font-size` on the scope carries the choice to content
    // wearing no `text-*` utility of its own.
    ({ addBase }) =>
      addBase({
        ":root": { "--font-scale-setting": "1", "--font-scale": "1" },
        [READING_SCOPE]: {
          "--font-scale": "var(--font-scale-setting, 1)",
          fontSize: `calc(1rem * ${SCALE})`,
        },
      }),
  ],
}
