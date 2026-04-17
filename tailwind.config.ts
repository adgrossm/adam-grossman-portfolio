import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        accent: "#E8FF00", // sharp yellow-green accent
        "accent-alt": "#FF3B3B", // sharp red for secondary emphasis
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
