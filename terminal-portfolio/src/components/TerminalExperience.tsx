"use client";

import {
  CSSProperties,
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { scrollTimeline } from "@/config/scrollTimeline";
import { staticCommandOutputs } from "@/config/commands";
import { ScrollTimelineEntry } from "@/types/scroll";
import { TerminalLine } from "@/types/terminal";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useTerminal } from "@/hooks/useTerminal";

import { TopBar } from "./Layout/TopBar";
import { ScrollSections } from "./Sections/ScrollSections";
import { TerminalShell } from "./Terminal/TerminalShell";

const bannerLines =
  staticCommandOutputs.banner.find(
    (line) => line.type === "ascii",
  )?.lines ?? [];

const isTextLine = (
  line: TerminalLine,
): line is Extract<TerminalLine, { type: "text" }> => line.type === "text";

const aboutPreviewLines = staticCommandOutputs.about
  .filter(isTextLine)
  .map((line) => line.text)
  .slice(0, 2);

type IntroPanelProps = {
  onActivateInteractive: () => void;
  aboutLines: string[];
  themeBackground: string;
  panelBorder: string;
  panelGlow: string;
};

const IntroPanel = ({
  onActivateInteractive,
  aboutLines,
  themeBackground,
  panelBorder,
  panelGlow,
}: IntroPanelProps) => {
  const [slideValue, setSlideValue] = useState(0);

  const handleSlide = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSlideValue(value);
    if (value >= 95) {
      onActivateInteractive();
      setTimeout(() => setSlideValue(0), 400);
    }
  };

  const sliderProgress = Math.min(Math.max(slideValue, 0), 100);
  const knobLeft = `calc(${sliderProgress}% - 18px)`;

  return (
    <div
      className="w-full max-w-4xl rounded-[2.5rem] border p-8 text-left shadow-[0_25px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors"
      style={{
        background: themeBackground,
        borderColor: panelBorder,
        boxShadow: panelGlow,
      }}
    >
      <div className="space-y-6">
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--color-text-secondary)]">
          {bannerLines.join("\n")}
        </pre>
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
          Terminal-first portfolio. Choose your path.
        </p>
        <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <p>
            Slide to activate the terminal, or scroll to watch the story mode
            stream each command with cinematic pacing.
          </p>
          {aboutLines.length > 0 && (
            <div
              className="rounded-2xl border p-4 text-[var(--color-text-primary)]"
              style={{
                background: "var(--surface-card-bg)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                About
              </p>
              {aboutLines.map((line) => (
                <p key={line} className="mt-2 text-sm leading-6">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
            Slide to activate interactive terminal
          </span>
          <div className="mt-3 w-full max-w-xl space-y-4">
            <div
              className="rounded-2xl border px-6 py-4 transition-all duration-300 hover:border-[var(--color-text-accent)]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
              style={{
                background: "var(--surface-overlay-bg)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.45em] text-[var(--color-text-secondary)]">
                <span>Interactive mode</span>
                <span>{sliderProgress}%</span>
              </div>
              <div className="mt-4 font-mono text-sm text-[var(--color-text-primary)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[var(--color-text-prompt)]">
                    rutts@workspace
                  </span>
                  <span className="text-[var(--color-text-secondary)]">$</span>
                  <span>start interactive</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                  drag handle to unlock
                </p>
              </div>
            </div>
            <div className="relative pt-4">
              <input
                type="range"
                min={0}
                max={100}
                value={slideValue}
                onChange={handleSlide}
                className="absolute inset-0 z-20 h-10 w-full cursor-ew-resize opacity-0"
              />
              <div className="relative h-2 rounded-full bg-[var(--surface-card-border)]/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-text-accent)] via-[var(--color-text-link)] to-[var(--color-text-accent)] transition-all duration-200"
                  style={{ width: `${sliderProgress}%` }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-white/15 bg-gradient-to-br from-[var(--color-text-accent)] to-white text-[#041b11] shadow-[0_15px_40px_rgba(0,0,0,0.4)] ring-4 ring-[var(--color-text-accent)]/20 transition-transform duration-200"
                  style={{ left: knobLeft }}
                >
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
                    →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </label>
        <div className="flex flex-col items-center gap-1 text-center text-xs uppercase tracking-[0.5em] text-[var(--color-text-secondary)]">
          <span>or scroll for story mode</span>
          <span className="text-3xl text-[var(--color-text-accent)] animate-bounce">
            ↓
          </span>
        </div>
      </div>
    </div>
  );
};

export const TerminalExperience = () => {
  const { themeName, theme, setTheme, cycleTheme } = useThemeManager();
  const {
    history,
    mode,
    currentInput,
    setCurrentInput,
    autoTypingText,
    isTyping,
    runCommand,
    enqueueAutoCommand,
    soundEnabled,
    toggleSound,
    enterInteractiveMode,
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

  const handleActivateInteractive = useCallback(
    () => enterInteractiveMode(),
    [enterInteractiveMode],
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
      "--surface-panel-bg": theme.surfaces.panel,
      "--surface-panel-border": theme.surfaces.panelBorder,
      "--surface-card-bg": theme.surfaces.card,
      "--surface-card-border": theme.surfaces.cardBorder,
      "--surface-overlay-bg": theme.surfaces.overlay,
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
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <TopBar
          themeLabel={theme.label}
          onCycleTheme={cycleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          themeName={themeName}
        />

        <IntroPanel
          onActivateInteractive={handleActivateInteractive}
          aboutLines={aboutPreviewLines}
          themeBackground={`linear-gradient(135deg, ${theme.terminal.background}, ${theme.body.background})`}
          panelBorder={theme.terminal.border}
          panelGlow={theme.terminal.glow}
        />

        {isInteractive && (
          <>
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

            {isInteractive ? (
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
            ) : (
              <div className="flex flex-col items-center gap-3 text-center text-sm text-[var(--color-text-secondary)]">
                <p className="text-[var(--color-text-primary)]">
                  Story mode is playing — keep scrolling to trigger the next
                  command.
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-text-accent)]">
                  Auto › {storyCommands.join(" · ")}
                </p>
              </div>
            )}
          </>
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

