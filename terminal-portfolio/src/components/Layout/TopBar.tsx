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
      className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 rounded-3xl border px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 backdrop-blur-lg"
      style={{
        background: "var(--surface-panel-bg)",
        borderColor: "var(--surface-panel-border)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="relative h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0 overflow-hidden rounded-full border border-[var(--surface-panel-border)] bg-black/40">
          <img
            src="/core-image.jpg"
            alt="0xRutts avatar"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] sm:text-xs md:text-sm font-semibold text-[var(--color-text-primary)] truncate">
            0xRutts
          </p>
          <p className="text-[0.6rem] sm:text-[0.65rem] md:text-xs text-[var(--color-text-secondary)] hidden sm:block">
            Full-Stack AI Engineer · ML Researcher
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-[var(--color-text-secondary)]">
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


