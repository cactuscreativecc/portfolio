import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary-fixed-dim": "#bbe400",
                "on-surface-variant": "#acabaa",
                "tertiary-fixed-dim": "#e7e5e4",
                "tertiary": "#fbf9f8",
                "surface-bright": "#2c2c2c",
                "inverse-primary": "#536600",
                "error-container": "#7e2b17",
                "surface-tint": "#aed500",
                "surface-variant": "#252626",
                "secondary-fixed": "#e5e2e1",
                "on-primary-fixed": "#374500",
                "background": "#0e0e0e",
                "surface": "#0e0e0e",
                "primary-fixed": "#c7f300",
                "surface-dim": "#0e0e0e",
                "on-tertiary-fixed-variant": "#676666",
                "on-error-container": "#ff9b82",
                "error": "#ed7f64",
                "on-secondary-fixed-variant": "#5c5b5b",
                "on-primary": "#374500",
                "on-secondary-fixed": "#403f3f",
                "surface-container-high": "#1f2020",
                "surface-container": "#191a1a",
                "secondary-dim": "#9f9d9d",
                "surface-container-highest": "#252626",
                "on-primary-fixed-variant": "#506300",
                "on-tertiary": "#5f5f5f",
                "error-dim": "#ba573f",
                "secondary": "#9f9d9d",
                "secondary-container": "#3c3b3b",
                "tertiary-fixed": "#f6f3f2",
                "primary-container": "#3d4d00",
                "on-tertiary-fixed": "#4a4949",
                "tertiary-container": "#edeaea",
                "on-error": "#450900",
                "tertiary-dim": "#edeaea",
                "surface-container-low": "#131313",
                "outline-variant": "#484848",
                "on-surface": "#e7e5e4",
                "inverse-surface": "#fcf8f8",
                "surface-container-lowest": "#000000",
                "outline": "#767575",
                "primary-dim": "#a2c600",
                "on-tertiary-container": "#575756",
                "on-secondary": "#202020",
                "secondary-fixed-dim": "#d6d4d3",
                "on-secondary-container": "#c1bfbe",
                "inverse-on-surface": "#565554",
                "primary": "#aed500",
                "on-background": "#e7e5e4",
                "on-primary-container": "#b7e000"
            },
            fontFamily: {
                "headline": ["var(--font-space-grotesk)", "Space Grotesk"],
                "body": ["var(--font-space-grotesk)", "Space Grotesk"],
                "label": ["var(--font-space-grotesk)", "Space Grotesk"],
                "sans": ["var(--font-space-grotesk)", "Space Grotesk"]
            },
            borderRadius: { "DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px" },
            keyframes: {
                shine: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" }
                }
            },
            animation: {
                shine: "shine 1.5s ease-in-out"
            }
        },
    },
    plugins: [],
};
export default config;
