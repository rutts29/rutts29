import { useCallback, useMemo, useState } from "react";

import { defaultTheme, getThemeByName, themeNames } from "@/config/themes";

export const useThemeManager = () => {
  // Always default to gruvbox on every visit (no persistence)
  const [themeName, setThemeName] = useState<string>(defaultTheme.name);

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
  };
};
