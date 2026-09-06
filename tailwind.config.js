/** @type {import('tailwindcss').Config} */

// Tokens are declared in src/index.css as bare OKLCH components so that the
// <alpha-value> placeholder keeps working (text-ink/60 and friends).
const token = (name) => `oklch(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        // --- PING palette ---
        // Named `ground`, not `base`: Tailwind already ships a `text-base`
        // font-size utility, and a colour of the same name generates a second
        // `.text-base` rule that silently repaints every heading using it.
        ground: token("--bg-ground"),
        artboard: token("--artboard"),
        raised: token("--bg-raised"),
        panel: token("--bg-panel"),
        hairline: token("--hairline"),
        brand: {
          DEFAULT: token("--brand"),
          hover: token("--brand-hover"),
          wash: token("--brand-wash"),
        },
        ink: {
          DEFAULT: token("--ink"),
          muted: token("--ink-muted"),
          faint: token("--ink-faint"),
          // Text sitting ON the accent or on a light artboard.
          inverse: token("--ink"),
        },
        "accent-ink": token("--accent-ink"),
        positive: token("--positive"),
        negative: token("--negative"),

        // --- shadcn/radix aliases, repointed at the palette above ---
        border: token("--border"),
        input: token("--input"),
        ring: token("--ring"),
        background: token("--background"),
        foreground: token("--foreground"),
        primary: {
          DEFAULT: token("--primary"),
          foreground: token("--primary-foreground"),
        },
        secondary: {
          DEFAULT: token("--secondary"),
          foreground: token("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: token("--destructive"),
          foreground: token("--destructive-foreground"),
        },
        muted: {
          DEFAULT: token("--muted"),
          foreground: token("--muted-foreground"),
        },
        accent: {
          DEFAULT: token("--accent"),
          foreground: token("--accent-foreground"),
        },
        popover: {
          DEFAULT: token("--popover"),
          foreground: token("--popover-foreground"),
        },
        card: {
          DEFAULT: token("--card"),
          foreground: token("--card-foreground"),
        },
      },

      fontFamily: {
        // One family, worked hard across weight and width, rather than a timid
        // display/body pair. Mono is reserved for hashes and addresses, where
        // monospacing is functional rather than costume.
        sans: ["Archivo", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Archivo", "system-ui", "sans-serif"],
        mono: ["'Martian Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },

      // Modular scale, 1.25 minimum between steps, fluid where it matters.
      fontSize: {
        micro: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        meta: ["0.8125rem", { lineHeight: "1.5" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        lead: ["clamp(1.0625rem, 0.9rem + 0.6vw, 1.3125rem)", { lineHeight: "1.55" }],
        h3: ["clamp(1.375rem, 1.1rem + 1vw, 1.75rem)", { lineHeight: "1.2" }],
        h2: ["clamp(1.75rem, 1.3rem + 1.9vw, 2.75rem)", { lineHeight: "1.1" }],
        h1: ["clamp(2.5rem, 1.6rem + 3.8vw, 4.5rem)", { lineHeight: "1" }],
        // Ceiling is 6rem; this stops short of shouting.
        hero: ["clamp(3rem, 1.4rem + 6.6vw, 5.75rem)", { lineHeight: "0.95" }],
      },

      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        pill: "var(--radius-pill)",
      },

      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        backdrop: "var(--z-backdrop)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },

      transitionTimingFunction: {
        "out-quart": "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },

      boxShadow: {
        panel: "0 1px 2px oklch(0% 0 0 / 0.4), 0 12px 32px oklch(0% 0 0 / 0.3)",
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
        "rise-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        // Only the outgoing layer animates, and it sits on top of an incoming
        // layer that is already fully opaque. A frozen frame therefore shows the
        // old character rather than nothing.
        "dissolve-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "accordion-down": "accordion-down var(--duration-normal) var(--ease-out)",
        "accordion-up": "accordion-up var(--duration-normal) var(--ease-out)",
        "rise-in": "rise-in var(--duration-slow) var(--ease-out) both",
        "dissolve-out": "dissolve-out 420ms var(--ease-out) forwards",
        "pulse-live": "pulse-live 2s var(--ease-out) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
