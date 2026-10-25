import { useSyncExternalStore } from "react";

import type { ResolvedTheme } from "@/components/UI/ThemeToggle";

type ThemePreference = ResolvedTheme | "system";

/** Must match the keys read by the boot script in app/layout.tsx. */
const storageKey = "simple-portfolio-theme";
const changeEvent = "simple-portfolio-theme-change";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

const readPreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
};

const getSnapshot = (): ResolvedTheme => {
  const preference = readPreference();
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// SSR renders the dark default; the boot script corrects <html> before paint.
const getServerSnapshot = (): ResolvedTheme => "dark";

const subscribe = (onChange: () => void) => {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  colorScheme.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
    colorScheme.removeEventListener("change", onChange);
  };
};

export const setThemePreference = (theme: ResolvedTheme) => {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    /* private mode: the choice lasts for this page only */
  }

  document.documentElement.dataset.simpleTheme = theme;
  document.documentElement.dataset.simpleResolved = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(changeEvent));
};

/** The resolved light/dark theme, kept in sync with storage and the OS. */
export const useSimpleTheme = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
