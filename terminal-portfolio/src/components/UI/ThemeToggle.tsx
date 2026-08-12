"use client";

import { Moon, Sun } from "lucide-react";

export type ResolvedTheme = "light" | "dark";

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: ResolvedTheme;
  onToggle: () => void;
}) {
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      className="portfolio-theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      data-theme={theme}
    >
      <span className="portfolio-theme-toggle-icon portfolio-theme-toggle-sun" aria-hidden="true">
        <Sun />
      </span>
      <span className="portfolio-theme-toggle-icon portfolio-theme-toggle-moon" aria-hidden="true">
        <Moon />
      </span>
    </button>
  );
}
