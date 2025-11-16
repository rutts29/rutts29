import { useCallback, useEffect, useMemo, useState } from "react";

import { defaultTheme, getThemeByName, themeNames } from "@/config/themes";

const THEME_STORAGE_KEY = "terminal-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return defaultTheme.name;
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored && themeNames.includes(stored) ? stored : defaultTheme.name;
};

export const useThemeManager = () => {
  const [themeName, setThemeName] = useState<string>(getInitialTheme);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }
  }, [themeName]);

  const theme = useMemo(() => getThemeByName(themeName), [themeName]);

  const setTheme = useCallback((name: string) => {
    if (themeNames.includes(name)) {
      setThemeName(name);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    const currentIndex = themeNames.findIndex((name) => name === themeName);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setThemeName(themeNames[nextIndex]);
  }, [themeName]);

  return {
    themeName,
    theme,
    setTheme,
    cycleTheme,
    themeNames,
  };
};
