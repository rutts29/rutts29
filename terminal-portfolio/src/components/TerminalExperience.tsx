"use client";

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useThemeManager } from "@/hooks/useThemeManager";
import { useTerminal } from "@/hooks/useTerminal";

import { TopBar } from "./Layout/TopBar";
import { BootSequence } from "./Terminal/BootSequence";
import { TerminalShell } from "./Terminal/TerminalShell";
import { GsapReveal } from "./GsapReveal";

const LIVE_SHELL_HINTS = [
  "about",
  "projects",
  "writing",
  "experience",
  "contact",
  "help",
] as const;

type IntroPanelProps = {
  onOpenLiveShell: () => void;
  themeBackground: string;
  panelBorder: string;
  panelGlow: string;
  liveShell?: ReactNode;
};

const IntroPanel = ({
  onOpenLiveShell,
  themeBackground,
  panelBorder,
  panelGlow,
  liveShell,
}: IntroPanelProps) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on the terminal window — spatial depth, no objects.
  // Disabled while typing so text stays flat.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) {
      return;
    }
    if (liveShell) {
      el.style.transform = "";
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !finePointer) {
      return;
    }

    let rx = 0;
    let ry = 0;
    let targetRx = 0;
    let targetRy = 0;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".terminal-cta")) {
        targetRx = 0;
        targetRy = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetRy = Math.max(-1, Math.min(1, dx)) * 2.5;
      targetRx = Math.max(-1, Math.min(1, dy)) * -2.5;
    };

    const loop = () => {
      rx += (targetRx - rx) * 0.08;
      ry += (targetRy - ry) * 0.08;
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      frame = window.requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    loop();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, [liveShell]);

  return (
    <div
      className="relative mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
      style={{ perspective: "1400px" }}
    >
      <div
        className="depth-glow"
        style={{
          width: "80%",
          height: "86%",
          left: "10%",
          top: "8%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-text-accent) 30%, transparent), transparent 62%)",
        }}
      />
      <div
        ref={tiltRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform .12s ease-out",
          willChange: "transform",
        }}
      >
        <div
          className="terminal-frame overflow-hidden rounded-[2rem] border backdrop-blur-2xl sm:rounded-[2.5rem]"
          style={{
            background: themeBackground,
            borderColor: panelBorder,
            boxShadow: panelGlow,
          }}
        >
          <div className="flex items-center gap-1.5 border-b border-[var(--surface-card-border)] px-3 py-2.5 sm:gap-2 sm:px-5 sm:py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] sm:h-3 sm:w-3" />
            <p className="ml-2 truncate text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:ml-4 sm:text-sm">
              rutts@workspace — ~/portfolio
            </p>
            <span className="ml-auto whitespace-nowrap text-[0.65rem] text-[var(--color-text-success)] sm:text-sm">
              {liveShell ? "● live shell" : "● ready"}
            </span>
          </div>

          <div
            className={`crt-screen flex flex-col rounded-b-[2rem] px-4 py-5 sm:rounded-b-[2.5rem] sm:px-8 sm:py-8 ${
              liveShell
                ? "h-[min(78vh,820px)] min-h-[560px]"
                : "h-[66vh] min-h-[500px] max-h-[680px]"
            }`}
          >
            {liveShell ? (
              <div className="min-h-0 min-w-0 flex-1">{liveShell}</div>
            ) : (
              <div className="no-scrollbar flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto sm:space-y-5">
                <BootSequence />

                <button
                  type="button"
                  onClick={onOpenLiveShell}
                  className="terminal-cta fade-up group flex w-full max-w-[1080px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 font-mono text-xs text-[var(--color-text-primary)] transition-all duration-300 hover:brightness-110 sm:gap-3 sm:px-6 sm:py-[1.125rem] sm:text-base"
                  style={{
                    background: "var(--surface-overlay-bg)",
                    borderColor: "var(--color-text-accent)",
                    animationDelay: "180ms",
                  }}
                >
                  <span className="whitespace-nowrap text-[var(--color-text-prompt)]">
                    rutts@workspace
                  </span>
                  <span className="text-[var(--color-text-secondary)]">$</span>
                  <span className="min-w-0 flex-1 break-words">
                    open live shell
                  </span>
                </button>
              </div>
            )}

            <div className="crt-scanlines" />
            <div className="crt-beam" />
            <div className="crt-vignette" />
            <div className="crt-flicker" />
          </div>
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
    runCommand,
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

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const scrollReset = window.setTimeout(() => window.scrollTo(0, 0), 0);

    return () => {
      window.clearTimeout(scrollReset);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

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

  const isLiveShell = mode === "interactive";
  const liveShell = isLiveShell ? (
    <TerminalShell
      embedded
      history={history}
      mode={mode}
      currentInput={currentInput}
      setCurrentInput={setCurrentInput}
      onSubmit={handleSubmit}
    />
  ) : undefined;

  return (
    <div
      className="terminal-experience min-h-screen transition-colors"
      style={themeVariables}
    >
      <div className="w-full px-3 py-6 sm:px-4 sm:py-10 md:px-8">
        <div className="mx-auto w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] 3xl:max-w-none 3xl:px-16">
          <GsapReveal>
            <TopBar
              themeLabel={theme.label}
              onCycleTheme={cycleTheme}
              themeName={themeName}
            />
          </GsapReveal>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] flex-col items-center gap-5 sm:gap-6 px-3 pb-10 sm:px-4 sm:pb-14 md:px-8">
        <div className="w-full">
          <IntroPanel
            onOpenLiveShell={enterInteractiveMode}
            themeBackground={`linear-gradient(135deg, ${theme.terminal.background}, ${theme.body.background})`}
            panelBorder={theme.terminal.border}
            panelGlow={theme.terminal.glow}
            liveShell={liveShell}
          />
        </div>

        {isLiveShell && (
          <div className="flex max-w-2xl flex-col items-center gap-3 text-center text-sm text-[var(--color-text-secondary)]">
            <p className="text-[var(--color-text-primary)]">
              Live shell — try:
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-text-accent)]">
              {LIVE_SHELL_HINTS.join(" · ")}
            </p>
            <p>
              Type{" "}
              <span className="font-mono text-[var(--color-text-primary)]">
                help
              </span>{" "}
              for the full list.
            </p>
          </div>
        )}

        <p className="mt-4 text-center text-[0.75rem] uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
          © 2026 0xRutts
        </p>
      </div>
    </div>
  );
};
