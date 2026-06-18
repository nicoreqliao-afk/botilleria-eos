import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta "Cava nocturna" — negro cálido, vino burdeos, oro champagne, crema.
        ink: {
          DEFAULT: "#100B0A", // fondo base, negro cálido casi tinto
          800: "#16100E",
          700: "#1C1513",
          600: "#241A18",
        },
        wine: {
          DEFAULT: "#6E1F2C",
          dark: "#4E141E",
          deep: "#3A0E16",
          light: "#8A2A38",
        },
        gold: {
          DEFAULT: "#C9A24B", // acento principal
          light: "#E2C57F",
          soft: "#D8B567",
          dark: "#A8842F",
        },
        cream: {
          DEFAULT: "#EDE6D6",
          muted: "#B7AD99",
          dim: "#857C6B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(201,162,75,0.35)",
        "wine-glow": "0 30px 90px -40px rgba(110,31,44,0.8)",
        card: "0 1px 0 0 rgba(237,230,214,0.06) inset, 0 30px 60px -40px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent, rgba(201,162,75,0.55), transparent)",
        "wine-radial":
          "radial-gradient(120% 120% at 50% 0%, rgba(110,31,44,0.45) 0%, rgba(16,11,10,0) 55%)",
        vignette:
          "radial-gradient(120% 100% at 50% 38%, transparent 55%, rgba(0,0,0,0.7) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pour-bob": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 1.2s ease both",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "pour-bob": "pour-bob 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
