import { useCallback, useEffect, useMemo, useState } from "react";

import { defaultTheme, getThemeByName, themeNames } from "@/config/themes";

const THEME_STORAGE_KEY = "terminal-theme";

export const useThemeManager = () => {
  const [themeName, setThemeName] = useState<string>(defaultTheme.name);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && themeNames.includes(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeName(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
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
