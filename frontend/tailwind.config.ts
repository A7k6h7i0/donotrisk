import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Violet (main brand color)
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        // Secondary - Teal (accent color)
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // Surface - Neutral light theme (replaces paper)
        surface: {
          white: "#ffffff",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Semantic colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // ─── Backward Compatibility Aliases ───
        // Old color names mapped to new system
        ink: "#171717",          // → surface-900
        paper: "#fafafa",        // → surface-50
        moss: "#5b7f3a",         // → success variant
        slate: "#304255",        // → surface-700
        ember: "#c24d2c",        // → error/warning variant
        
        // Indigo for backward compatibility
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        
        // Accent for backward compatibility
        accent: {
          light: "#fef3c7",
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          teal: "#0d9488",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        ui: ["var(--font-jakarta)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0d9488 100%)",
        "premium-gradient": "linear-gradient(135deg, #0d0f14 0%, #1e1b4b 50%, #0f172a 100%)",
        "primary-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        "secondary-gradient": "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
        "violet-gradient": "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        "warm-gradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "cool-gradient": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "nature-gradient": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        "amber-gradient": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
        "mesh-gradient": "radial-gradient(at 40% 20%, rgba(124,58,237,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(79,70,229,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(13,148,136,0.08) 0px, transparent 50%)",
        "shimmer": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "float": "float-gentle 6s ease-in-out infinite",
        "float-slow": "float-gentle 9s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "shimmer-slide": "shimmer-slide 4s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "blob": "blob 8s infinite",
        "orbit": "orbit 3s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        // Page transition animations
        "page-enter": "pageEnter 0.4s ease-out forwards",
        "page-exit": "pageExit 0.3s ease-in forwards",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(32px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "shimmer-slide": { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "300% 50%" } },
        "gradient-shift": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
        wiggle: { "0%, 100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        blob: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(28px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(28px) rotate(-360deg)" },
        },
        "ping-slow": { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
        // Page transition keyframes
        pageEnter: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pageExit: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      boxShadow: {
        "premium": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "card": "0 0 0 1px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(124, 58, 237, 0.12)",
        "glow-primary": "0 0 40px rgba(124, 58, 237, 0.35)",
        "glow-secondary": "0 0 40px rgba(13, 148, 136, 0.3)",
        "glow-violet": "0 0 40px rgba(124, 58, 237, 0.35)",
        "glow-indigo": "0 0 40px rgba(79, 70, 229, 0.35)",
        "glow-teal": "0 0 40px rgba(13, 148, 136, 0.3)",
        "glow-amber": "0 0 30px rgba(245, 158, 11, 0.3)",
        "glow-sm": "0 0 20px rgba(124, 58, 237, 0.25)",
        "glow-sm-primary": "0 0 20px rgba(124, 58, 237, 0.25)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        "navbar": "0 1px 40px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(255,255,255,0.8) inset",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      transitionDuration: {
        "400": "400ms",
      },
      letterSpacing: {
        "tighter": "-0.05em",
        "tight": "-0.025em",
        "normal": "0",
        "wide": "0.025em",
        "wider": "0.05em",
        "widest": "0.1em",
      },
      backdropBlur: {
        "2xl": "40px",
        "3xl": "60px",
      },
    },
  },
  plugins: [],
};

export default config;
