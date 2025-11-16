"use client";

import { CSSProperties, useCallback, useEffect, useMemo } from "react";

import { scrollTimeline } from "@/config/scrollTimeline";
import { ScrollTimelineEntry } from "@/types/scroll";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useTerminal } from "@/hooks/useTerminal";

import { TopBar } from "./Layout/TopBar";
import { ScrollSections } from "./Sections/ScrollSections";
import { TerminalShell } from "./Terminal/TerminalShell";

export const TerminalExperience = () => {
  const { themeName, theme, setTheme, cycleTheme } = useThemeManager();
  const {
    history,
    mode,
    setMode,
    currentInput,
    setCurrentInput,
    autoTypingText,
    isTyping,
    runCommand,
    enqueueAutoCommand,
    soundEnabled,
    toggleSound,
  } = useTerminal({
    onThemeChange: setTheme,
    themeName,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      enqueueAutoCommand("help");
    }, 600);
    return () => clearTimeout(timeout);
  }, [enqueueAutoCommand]);

  const handleSubmit = useCallback(
    (command: string) => {
      const trimmed = command.trim();
      if (!trimmed) {
        return;
      }
      runCommand(trimmed).finally(() => setCurrentInput(""));
    },
    [runCommand, setCurrentInput],
  );

  const handleSectionTrigger = useCallback(
    (entry: ScrollTimelineEntry) => {
      if (mode !== "scrollAuto") {
        return;
      }
      enqueueAutoCommand(entry.command);
    },
    [enqueueAutoCommand, mode],
  );

  const themeVariables = useMemo(() => {
    const layeredBackground = theme.body.texture
      ? `${theme.body.texture}, ${theme.body.background}`
      : theme.body.background;

    return {
      "--color-text-primary": theme.text.primary,
      "--color-text-secondary": theme.text.secondary,
      "--color-text-accent": theme.text.accent,
      "--color-text-prompt": theme.text.prompt,
      "--color-text-link": theme.text.link,
      "--color-text-success": theme.text.accent,
      "--color-text-error": "#ff6b6b",
      "--color-button-bg": theme.controls.buttonBg,
      "--color-button-hover": theme.controls.buttonHover,
      "--color-button-text": theme.controls.buttonText,
      "--terminal-bg": theme.terminal.background,
      "--terminal-border": theme.terminal.border,
      "--terminal-glow": theme.terminal.glow,
      backgroundImage: layeredBackground,
      backgroundColor: "#030303",
    } as CSSProperties;
  }, [theme]);

  return (
    <div
      className="min-h-screen px-4 py-10 transition-colors md:px-10"
      style={themeVariables}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <TopBar
            themeLabel={theme.label}
            onCycleTheme={cycleTheme}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            mode={mode}
            onModeChange={setMode}
          />
          <TerminalShell
            history={history}
            mode={mode}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            autoTypingText={autoTypingText}
            isTyping={isTyping}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="w-full lg:w-[320px]">
          <ScrollSections
            sections={scrollTimeline}
            onTrigger={handleSectionTrigger}
            initialTriggered={["hero"]}
            disabled={mode !== "scrollAuto"}
          />
        </div>
      </div>
    </div>
  );
};

