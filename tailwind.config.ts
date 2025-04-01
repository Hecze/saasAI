import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        // App-specific colors
        app: {
          bg: "#0a0a12",
          card: {
            dark: "#0f0f1a",
            border: "rgba(139,92,246,0.1)",
            light: "rgba(139,92,246,0.3)",
            lighter: "rgba(139,92,246,0.5)",
          },
          purple: {
            light: "rgb(235, 216, 255)",
            DEFAULT: "#8b5cf6",
            dark: "#7c3aed",
          },
          indigo: {
            light: "#c7d2fe", 
            DEFAULT: "#6366f1",
            dark: "#4f46e5",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Custom utility classes
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(88,28,135,0.2) 0%, rgba(79,70,229,0.1) 50%, #0a0a12 100%)',
        'section-gradient': 'linear-gradient(180deg, #0a0a12 0%, #0f0f1a 50%, #0a0a12 100%)',
        'card-gradient': 'linear-gradient(to bottom right, #111827, #1f2937)',
        'primary-button': 'linear-gradient(to right, #7c3aed, #4f46e5)',
        'primary-button-hover': 'linear-gradient(to right, #6d28d9, #4338ca)',
      },
      textColor: {
        'gradient-text': 'transparent',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(139,92,246,0.1)',
        'glow': '0 0 15px rgba(139,92,246,0.15)',
        'glow-md': '0 0 15px rgba(139,92,246,0.3)',
        'glow-lg': '0 0 25px rgba(139,92,246,0.3)',
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

