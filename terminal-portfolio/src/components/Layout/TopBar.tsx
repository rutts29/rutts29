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
      className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border px-6 py-4 backdrop-blur-lg"
      style={{
        background: "var(--surface-panel-bg)",
        borderColor: "var(--surface-panel-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--surface-panel-border)] bg-black/40">
          <img
            src="/core-image.jpg"
            alt="0xRutts avatar"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            0xRutts
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Full-Stack AI Engineer · ML Researcher
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-4">
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
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
              className="h-4 w-4"
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
              className="h-4 w-4"
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
              className="h-4 w-4"
            />
          </a>
        </div>
        <button
          type="button"
          onClick={onCycleTheme}
          className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-secondary)] transition"
          style={{
            background: "var(--surface-card-bg)",
            borderColor: "var(--surface-card-border)",
          }}
        >
          <span className="relative flex h-5 w-10 items-center rounded-full bg-[var(--surface-panel-border)]/40 p-0.5">
            <span
              className="absolute h-4 w-4 rounded-full bg-[var(--color-text-accent)] shadow-[0_0_12px_rgba(0,0,0,0.35)] transition-transform"
              style={{
                transform:
                  themeName === "light"
                    ? "translateX(20px)"
                    : themeName === "monokai"
                      ? "translateX(10px)"
                      : "translateX(0px)",
              }}
            />
            <span className="sr-only">Theme toggle</span>
          </span>
          <span>{themeLabel}</span>
        </button>
      </div>
    </div>
  );
};


