"use client";

import {
  CSSProperties,
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const fullText = "Want to explore specifics yourself? Enter interactive mode";
  const hasAnimatedRef = useRef(false);

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

  // Typewriter effect - only trigger on mount or when scrolled to top
  useEffect(() => {
    if (interactiveComponent) {
      setShowTypewriter(false);
      setTypewriterText(fullText);
      hasAnimatedRef.current = false;
      return;
    }

    let typeInterval: NodeJS.Timeout | null = null;

    const startTypewriter = () => {
      if (hasAnimatedRef.current) return;
      
      hasAnimatedRef.current = true;
      setShowTypewriter(true);
      setTypewriterText("");
      let currentIndex = 0;
      
      typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypewriterText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typeInterval) clearInterval(typeInterval);
        }
      }, 20); // Adjust speed here (lower = faster)
    };

    // Check on mount if at top
    const isAtTop = typeof window !== "undefined" && window.scrollY < 50;
    if (isAtTop && !hasAnimatedRef.current) {
      // Small delay to ensure page is loaded
      const timeoutId = setTimeout(() => {
        startTypewriter();
      }, 300);
      return () => {
        clearTimeout(timeoutId);
        if (typeInterval) clearInterval(typeInterval);
      };
    }

    // Listen for scroll to top
    const scrollHandler = () => {
      const isAtTopNow = window.scrollY < 50;
      if (isAtTopNow && !hasAnimatedRef.current) {
        startTypewriter();
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [interactiveComponent, fullText]);

  return (
    <div
      className="w-full max-w-4xl rounded-[2.5rem] border p-3 sm:p-6 md:p-8 text-left shadow-[0_25px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors"
      style={{
        background: themeBackground,
        borderColor: panelBorder,
        boxShadow: panelGlow,
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        {!interactiveComponent && (
          <>
            <pre className="overflow-x-auto whitespace-pre text-[0.4rem] leading-[1.1] text-[var(--color-text-secondary)] sm:text-[0.5rem] md:text-xs sm:leading-normal px-2 py-2 sm:px-0 sm:py-0">
              {bannerLines.join("\n")}
            </pre>
            {aboutLines.length > 0 && (
              <div
                className="rounded-2xl border p-3 sm:p-4 text-[var(--color-text-primary)]"
                style={{
                  background: "var(--surface-card-bg)",
                  borderColor: "var(--surface-card-border)",
                }}
              >
                <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
                  About
                </p>
                {aboutLines.map((line) => (
                  <p key={line} className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6">
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
              className="group flex w-full max-w-[960px] cursor-pointer items-center gap-2 sm:gap-3 rounded-2xl border px-3 py-2.5 sm:px-6 sm:py-4 font-mono text-[0.7rem] sm:text-sm text-[var(--color-text-primary)] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 animate-subtle-border-glow"
              style={{
                background: "var(--surface-overlay-bg)",
                borderColor: "var(--color-text-accent)",
                boxShadow: `${panelGlow}, 0 25px 60px rgba(0,0,0,0.16)`,
              }}
            >
              <span className="text-[var(--color-text-prompt)] whitespace-nowrap">
                rutts@workspace
              </span>
              <span className="text-[var(--color-text-secondary)]">$</span>
            <span className="flex-1 min-w-0 break-words">
              {typewriterText || fullText}
              {showTypewriter && typewriterText.length < fullText.length && (
                <span className="terminal-cursor ml-1" />
              )}
            </span>
              <span className="ml-auto flex h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-text-accent)]/10 text-[var(--color-text-accent)] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--color-text-accent)]/20">
                →
              </span>
            </button>
            <div className="flex flex-col items-center gap-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] text-[var(--color-text-secondary)]">
              <span className="text-center px-2">Scroll to continue exploring the showcase</span>
              <span className="mt-1 sm:mt-2 text-2xl sm:text-3xl text-[var(--color-text-accent)] animate-bounce">
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
          <TopBar
            themeLabel={theme.label}
            onCycleTheme={cycleTheme}
            themeName={themeName}
          />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 sm:gap-6 md:gap-8 px-3 py-8 sm:px-4 sm:py-12 md:px-8">
        <div
          ref={introPanelRef}
          style={{
            transform: introPanelTransform,
            willChange: "transform",
            transition: isMobile ? "none" : "transform 0.1s ease-out",
          }}
        >
          <IntroPanel
            onActivateInteractive={handleActivateInteractive}
            aboutLines={aboutPreviewLines}
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

        <div className="mt-16 sm:mt-20 md:mt-24 flex w-full justify-center border-t border-[var(--surface-card-border)] pt-8">
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
                priority={false}
              />
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[0.75rem] uppercase tracking-[0.4em] text-[var(--color-text-secondary)]">
          © 2025 0xRutts
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

