import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#334155",
          foreground: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
