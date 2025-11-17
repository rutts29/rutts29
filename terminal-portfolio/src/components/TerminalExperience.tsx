"use client";

import {
  CSSProperties,
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

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
  interactiveComponent?: ReactNode;
};

const IntroPanel = ({
  onActivateInteractive,
  aboutLines,
  themeBackground,
  panelBorder,
  panelGlow,
  interactiveComponent,
}: IntroPanelProps) => {
  const [slideValue, setSlideValue] = useState(0);

  const handleSlide = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSlideValue(value);
    if (value >= 95) {
      onActivateInteractive();
      setTimeout(() => setSlideValue(0), 300);
    }
  };

  const sliderProgress = Math.max(0, slideValue - 5);
  const knobLeft = `calc(${slideValue}% - 24px)`;

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
        {!interactiveComponent && (
          <>
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--color-text-secondary)]">
              {bannerLines.join("\n")}
            </pre>
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
          </>
        )}
        {!interactiveComponent ? (
          <>
            <button
              type="button"
              onClick={onActivateInteractive}
              className="group flex w-full max-w-[960px] cursor-pointer items-center gap-3 rounded-2xl border px-6 py-4 font-mono text-sm text-[var(--color-text-primary)] transition-all duration-300 hover:border-[var(--color-text-accent)]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
              style={{
                background: "var(--surface-overlay-bg)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <span className="text-[var(--color-text-prompt)]">
                rutts@workspace
              </span>
              <span className="text-[var(--color-text-secondary)]">$</span>
            <span>Want to explore specifics yourself? Enter interactive mode</span>
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-text-accent)]/10 text-[var(--color-text-accent)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--color-text-accent)]/20">
                →
              </span>
            </button>
            <div className="flex flex-col items-center gap-1 text-xs uppercase tracking-[0.5em] text-[var(--color-text-secondary)]">
              <span>Scroll to continue exploring the showcase</span>
              <span className="mt-2 text-3xl text-[var(--color-text-accent)] animate-bounce">
                ↓
              </span>
            </div>
          </>
        ) : (
          <div className="mt-6 w-full">{interactiveComponent}</div>
        )}
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
  const interactiveComponent = isInteractive ? (
    <div className="w-full">
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
  ) : undefined;

  return (
    <div
      className="min-h-screen px-4 py-12 transition-colors md:px-8"
      style={themeVariables}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <TopBar
          themeLabel={theme.label}
          onCycleTheme={cycleTheme}
          themeName={themeName}
        />

        <IntroPanel
          onActivateInteractive={handleActivateInteractive}
          aboutLines={aboutPreviewLines}
          themeBackground={`linear-gradient(135deg, ${theme.terminal.background}, ${theme.body.background})`}
          panelBorder={theme.terminal.border}
          panelGlow={theme.terminal.glow}
          interactiveComponent={interactiveComponent}
        />

        {isInteractive && (
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
        <ScrollSections
          sections={scrollTimeline}
          onTrigger={handleSectionTrigger}
          initialTriggered={[]}
        />

        <div className="mt-8 flex w-full justify-center border-t border-[var(--surface-card-border)] pt-8">
          <div className="relative h-48 w-full max-w-[1200px] md:h-52">
            <Image
              src="/image.png"
              alt="0xRutts footer banner"
              fill
              sizes="(max-width: 1024px) 1024px, 1400px"
              className="object-cover opacity-80"
              priority={false}
            />
          </div>
        </div>
        <p className="mt-6 text-center text-[0.75rem] uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
          © 2025 0xRutts
        </p>
      </div>
    </div>
  );
};

