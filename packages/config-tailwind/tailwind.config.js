const animate = require("tailwindcss-animate")

const spacingTokens = require("@typhed/brand/tokens/spacing.json")
const typographyTokens = require("@typhed/brand/tokens/typography.json")

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
  plugins: [animate],
}
