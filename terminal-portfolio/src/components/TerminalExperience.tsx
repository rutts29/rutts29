"use client";

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { scrollTimeline } from "@/config/scrollTimeline";
import { ScrollTimelineEntry } from "@/types/scroll";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useTerminal } from "@/hooks/useTerminal";

import { TopBar } from "./Layout/TopBar";
import { ScrollSections } from "./Sections/ScrollSections";
import { BootSequence } from "./Terminal/BootSequence";
import { TerminalShell } from "./Terminal/TerminalShell";
import { GsapReveal } from "./GsapReveal";

type IntroPanelProps = {
  onActivateInteractive: () => void;
  themeBackground: string;
  panelBorder: string;
  panelGlow: string;
  interactiveComponent?: ReactNode;
};

const IntroPanel = ({
  onActivateInteractive,
  themeBackground,
  panelBorder,
  panelGlow,
  interactiveComponent,
}: IntroPanelProps) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on the terminal window — spatial depth, no objects.
  // Disabled while reading/typing in the live terminal so text stays flat.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) {
      return;
    }
    if (interactiveComponent) {
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
  }, [interactiveComponent]);

  return (
    <div
      className="relative mx-auto w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
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
          className="overflow-hidden rounded-[2rem] border backdrop-blur-2xl sm:rounded-[2.5rem]"
          style={{
            background: themeBackground,
            borderColor: panelBorder,
            boxShadow: panelGlow,
          }}
        >
          <div className="flex items-center gap-1.5 border-b border-[var(--surface-card-border)] px-3 py-2.5 sm:gap-2 sm:px-5 sm:py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] sm:h-3 sm:w-3" />
            <p className="ml-2 truncate text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-secondary)] sm:ml-4 sm:text-xs">
              rutts@workspace — ~/portfolio
            </p>
            <span className="ml-auto whitespace-nowrap text-[0.6rem] text-[var(--color-text-success)] sm:text-xs">
              {interactiveComponent ? "● interactive" : "● ready"}
            </span>
          </div>

          <div className="crt-screen flex h-[64vh] min-h-[460px] max-h-[620px] flex-col px-4 py-5 sm:px-7 sm:py-7">
            {interactiveComponent ? (
              <div className="min-h-0 min-w-0 flex-1">{interactiveComponent}</div>
            ) : (
              <div className="no-scrollbar flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto sm:space-y-5">
                <BootSequence />

                <button
                  type="button"
                  onClick={onActivateInteractive}
                  className="fade-up group flex w-full max-w-[960px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 font-mono text-[0.7rem] text-[var(--color-text-primary)] transition-all duration-300 hover:scale-[1.01] hover:brightness-110 sm:gap-3 sm:px-6 sm:py-4 sm:text-sm"
                  style={{
                    background: "var(--surface-overlay-bg)",
                    borderColor: "var(--color-text-accent)",
                    boxShadow: `${panelGlow}, 0 20px 50px rgba(0,0,0,0.18)`,
                    animationDelay: "180ms",
                  }}
                >
                  <span className="whitespace-nowrap text-[var(--color-text-prompt)]">
                    rutts@workspace
                  </span>
                  <span className="text-[var(--color-text-secondary)]">$</span>
                  <span className="min-w-0 flex-1 break-words">
                    unlock interactive mode — run every command yourself
                  </span>
                  <span className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-text-accent)]/10 text-[var(--color-text-accent)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--color-text-accent)]/20 sm:h-6 sm:w-6">
                    →
                  </span>
                </button>

                <div
                  className="fade-up flex flex-col items-center gap-1 text-[0.6rem] uppercase tracking-[0.5em] text-[var(--color-text-secondary)] sm:text-xs"
                  style={{ animationDelay: "260ms" }}
                >
                  <span className="px-2 text-center">
                    Scroll to continue exploring the showcase
                  </span>
                  <span className="mt-1 animate-bounce text-2xl text-[var(--color-text-accent)] sm:mt-2 sm:text-3xl">
                    ↓
                  </span>
                </div>
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
    autoTypingText,
    isTyping,
    runCommand,
    enqueueAutoCommand,
    enterInteractiveMode,
  } = useTerminal({
    onThemeChange: setTheme,
    themeName,
  });
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const introPanelRef = useRef<HTMLDivElement>(null);

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

  // Disable browser scroll restoration and force scroll to top on load/refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable browser's automatic scroll restoration
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      // Force scroll to top immediately
      window.scrollTo(0, 0);
      // Also set it after a tiny delay to ensure it sticks
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, []);

  // Parallax scroll effect with requestAnimationFrame for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          // Check if scrolled past intro panel/terminal shell
          if (introPanelRef.current) {
            const rect = introPanelRef.current.getBoundingClientRect();
            const isPastTerminal = window.scrollY > rect.bottom + 100;
            setShowScrollToTop(isPastTerminal);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Detect mobile to disable transitions for smoother scrolling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const isInteractive = mode === "interactive";
  const interactiveComponent = isInteractive ? (
    <TerminalShell
      embedded
      history={history}
      mode={mode}
      currentInput={currentInput}
      setCurrentInput={setCurrentInput}
      autoTypingText={autoTypingText}
      isTyping={isTyping}
      onSubmit={handleSubmit}
    />
  ) : undefined;

  // Calculate parallax transforms - use translate3d for hardware acceleration
  const topBarTransform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
  // IntroPanel moves up (negative) to prevent overlap with sections
  const introPanelTransform = `translate3d(0, ${-scrollY * 0.15}px, 0)`;

  return (
    <div
      className="min-h-screen transition-colors"
      style={themeVariables}
    >
      <div
        style={{
          transform: topBarTransform,
          willChange: "transform",
          transition: isMobile ? "none" : "transform 0.1s ease-out",
        }}
        className="w-full px-3 py-8 sm:px-4 sm:py-12 md:px-8"
      >
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
      <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col items-center gap-4 sm:gap-6 md:gap-8 px-3 py-8 sm:px-4 sm:py-12 md:px-8">
        <div
          ref={introPanelRef}
          className="w-full"
          style={{
            transform: introPanelTransform,
            willChange: "transform",
            transition: isMobile ? "none" : "transform 0.1s ease-out",
          }}
        >
          <IntroPanel
            onActivateInteractive={enterInteractiveMode}
            themeBackground={`linear-gradient(135deg, ${theme.terminal.background}, ${theme.body.background})`}
            panelBorder={theme.terminal.border}
            panelGlow={theme.terminal.glow}
            interactiveComponent={interactiveComponent}
          />
        </div>

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

        <GsapReveal className="mt-16 sm:mt-20 md:mt-24 flex w-full justify-center border-t border-[var(--surface-card-border)] pt-8">
          <div className="relative h-48 w-full max-w-[1200px] md:h-52 flex items-center justify-center">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full border-2 overflow-hidden"
              style={{
                borderColor: "var(--surface-panel-border)",
              }}
            >
              <Image
                src="/core-image.jpg"
                alt="0xRutts avatar"
                fill
                sizes="(max-width: 768px) 128px, 192px"
                className="object-cover"

              />
            </div>
          </div>
        </GsapReveal>
        <p className="mt-6 text-center text-[0.75rem] uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
          © 2026 0xRutts
        </p>
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border backdrop-blur-lg transition-all duration-300 hover:scale-110 hover:brightness-110"
          style={{
            background: "var(--surface-panel-bg)",
            borderColor: "var(--color-text-accent)",
            boxShadow: "0 0 15px var(--color-text-accent), 0 4px 20px rgba(0,0,0,0.3)",
          }}
          aria-label="Scroll to top"
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-text-accent)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
