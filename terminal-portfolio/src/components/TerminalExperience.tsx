"use client";

import { CSSProperties, useCallback, useMemo } from "react";

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

  const storyCommands = scrollTimeline.map((section) => section.command);

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

  const isInteractive = mode === "interactive";

  return (
    <div
      className="min-h-screen px-4 py-12 transition-colors md:px-8"
      style={themeVariables}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <TopBar
          themeLabel={theme.label}
          onCycleTheme={cycleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          mode={mode}
          onModeChange={setMode}
        />

        <div className="w-full max-w-4xl">
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

        {!isInteractive ? (
          <div className="flex flex-col items-center gap-4 text-center text-[var(--color-text-secondary)]">
            <p className="text-base text-[var(--color-text-primary)]">
              Scroll to explore the story, or switch to interactive mode to type
              commands yourself.
            </p>
            <button
              type="button"
              onClick={() => setMode("interactive")}
              className="rounded-full border border-white/15 bg-black/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-primary)] transition hover:border-white/40 hover:text-[var(--color-text-accent)]"
            >
              Activate Interactive Terminal
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.5em]">
                Scroll to explore
              </span>
              <span className="text-3xl text-[var(--color-text-accent)] animate-bounce">
                ↓
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center text-sm text-[var(--color-text-secondary)]">
            <p className="text-[var(--color-text-primary)]">
              Interactive mode unlocked — try running these commands:
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-accent)]">
              {storyCommands.join(" · ")}
            </p>
            <p>
              Need a refresher? Type{" "}
              <span className="font-mono text-[var(--color-text-primary)]">
                help
              </span>{" "}
              to see everything available.
            </p>
          </div>
        )}
      </div>

      <ScrollSections
        sections={scrollTimeline}
        onTrigger={handleSectionTrigger}
        initialTriggered={[]}
        disabled={mode !== "scrollAuto"}
      />
    </div>
  );
};

