"use client";

type TopBarProps = {
  themeLabel: string;
  onCycleTheme: () => void;
  themeName: string;
};

export const TopBar = ({
  themeLabel,
  onCycleTheme,
  themeName,
}: TopBarProps) => {
  return (
    <div
      className="w-full flex items-center justify-between gap-4 sm:gap-6 rounded-3xl border px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-4 lg:px-16 lg:py-5 backdrop-blur-lg shadow-[0_25px_120px_rgba(0,0,0,0.25)]"
      style={{
        background: "var(--surface-panel-bg)",
        borderColor: "var(--surface-panel-border)",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 25px 120px rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] truncate">
            0xRutts
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[var(--color-text-secondary)] hidden sm:block mt-2 sm:mt-2.5 md:mt-3">
            Full-Stack AI Engineer · ML Researcher
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 text-[var(--color-text-secondary)]">
          <a
            href="https://github.com/rutts29"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-text-accent)]"
          >
            <span className="sr-only">GitHub</span>
            <img
              src="https://cdn.simpleicons.org/github/ffffff"
              alt="GitHub"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              style={{
                filter: themeName === "light" ? "invert(1)" : "none",
              }}
            />
          </a>
          <a
            href="https://www.linkedin.com/in/ruttansh-bhatelia/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-text-accent)]"
          >
            <span className="sr-only">LinkedIn</span>
            <img
              src="/linkedin-svg.svg"
              alt="LinkedIn"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            />
          </a>
          <a
            href="https://x.com/0xRutts"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--color-text-accent)]"
          >
            <span className="sr-only">X (Twitter)</span>
            <img
              src="https://cdn.simpleicons.org/x/ffffff"
              alt="X"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              style={{
                filter: themeName === "light" ? "invert(1)" : "none",
              }}
            />
          </a>
        </div>
        <button
          type="button"
          onClick={onCycleTheme}
          className="flex items-center gap-1 sm:gap-2 rounded-full border px-2 py-0.5 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-secondary)] transition"
          style={{
            background: "var(--surface-card-bg)",
            borderColor: "var(--surface-card-border)",
          }}
        >
          <span className="relative flex h-4 w-8 sm:h-5 sm:w-10 items-center rounded-full bg-[var(--surface-panel-border)]/40 p-0.5">
            <span
              className="absolute h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[var(--color-text-accent)] shadow-[0_0_12px_rgba(0,0,0,0.35)] transition-transform"
              style={{
                transform:
                  themeName === "light"
                    ? "translateX(16px)"
                    : themeName === "monokai"
                      ? "translateX(8px)"
                      : "translateX(0px)",
              }}
            />
            <span className="sr-only">Theme toggle</span>
          </span>
          <span className="hidden sm:inline">{themeLabel}</span>
        </button>
      </div>
    </div>
  );
};


