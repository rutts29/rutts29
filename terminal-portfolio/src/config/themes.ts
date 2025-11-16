import { ThemeTokens } from "@/types/theme";

export const themes: ThemeTokens[] = [
  {
    name: "matrix",
    label: "Matrix",
    body: {
      background: "linear-gradient(180deg,#030303 0%,#020d05 100%)",
      texture:
        "radial-gradient(circle at 10% 20%, rgba(0,255,140,0.08) 0%, transparent 50%)",
    },
    terminal: {
      background: "rgba(3, 20, 10, 0.85)",
      border: "rgba(12, 255, 152, 0.3)",
      glow: "0 0 30px rgba(12, 255, 152, 0.25)",
    },
    text: {
      primary: "#d2ffe5",
      secondary: "#6eedb4",
      prompt: "#7cffa9",
      accent: "#0cff98",
      link: "#4affc2",
    },
    controls: {
      buttonBg: "rgba(12, 255, 152, 0.12)",
      buttonHover: "rgba(12, 255, 152, 0.24)",
      buttonText: "#bfffea",
      icon: "#7cffa9",
    },
  },
  {
    name: "gruvbox",
    label: "Gruvbox",
    body: {
      background: "linear-gradient(180deg,#1b140d 0%,#0d0905 100%)",
      texture:
        "radial-gradient(circle at 90% 30%, rgba(245,170,66,0.1) 0%, transparent 45%)",
    },
    terminal: {
      background: "rgba(28, 20, 12, 0.92)",
      border: "rgba(247, 171, 66, 0.35)",
      glow: "0 0 30px rgba(247, 171, 66, 0.18)",
    },
    text: {
      primary: "#f4e1c6",
      secondary: "#c6b28a",
      prompt: "#f7ab42",
      accent: "#fabd2f",
      link: "#fe8019",
    },
    controls: {
      buttonBg: "rgba(247, 171, 66, 0.16)",
      buttonHover: "rgba(247, 171, 66, 0.28)",
      buttonText: "#fff4df",
      icon: "#f7ab42",
    },
  },
  {
    name: "monokai",
    label: "Monokai",
    body: {
      background: "linear-gradient(180deg,#1e1f1c 0%,#101010 100%)",
      texture:
        "radial-gradient(circle at 20% 80%, rgba(255,121,198,0.08) 0%, transparent 55%)",
    },
    terminal: {
      background: "rgba(33, 32, 28, 0.92)",
      border: "rgba(255, 121, 198, 0.35)",
      glow: "0 0 30px rgba(255, 121, 198, 0.2)",
    },
    text: {
      primary: "#f8f8f2",
      secondary: "#b6b6b2",
      prompt: "#f92672",
      accent: "#a6e22e",
      link: "#66d9ef",
    },
    controls: {
      buttonBg: "rgba(255, 121, 198, 0.14)",
      buttonHover: "rgba(255, 121, 198, 0.26)",
      buttonText: "#fff",
      icon: "#f92672",
    },
  },
  {
    name: "light",
    label: "Light",
    body: {
      background: "linear-gradient(180deg,#fbfbfb 0%,#e9ecf1 100%)",
      texture:
        "radial-gradient(circle at 15% 25%, rgba(0,71,187,0.08) 0%, transparent 40%)",
    },
    terminal: {
      background: "rgba(255, 255, 255, 0.92)",
      border: "rgba(12, 41, 87, 0.15)",
      glow: "0 0 30px rgba(31, 57, 104, 0.1)",
    },
    text: {
      primary: "#0c1b33",
      secondary: "#4c5a6e",
      prompt: "#0047bb",
      accent: "#006bff",
      link: "#0047bb",
    },
    controls: {
      buttonBg: "rgba(0, 107, 255, 0.08)",
      buttonHover: "rgba(0, 107, 255, 0.16)",
      buttonText: "#0c1b33",
      icon: "#0047bb",
    },
  },
];

export const defaultTheme = themes[0];

export const themeMap = themes.reduce<Record<string, ThemeTokens>>(
  (acc, theme) => {
    acc[theme.name] = theme;
    return acc;
  },
  {},
);

export const themeNames = themes.map((theme) => theme.name);

export const getThemeByName = (name: string) => themeMap[name] ?? defaultTheme;

