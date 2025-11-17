"use client";

type TopBarProps = {
  themeLabel: string;
  onCycleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  themeName: string;
};

export const TopBar = ({
  themeLabel,
  onCycleTheme,
  soundEnabled,
  onToggleSound,
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
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          rutts@portfolio
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          AI Engineer • LLM Researcher
        </p>
      </div>
      <div className="flex items-center gap-3">
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
        <button
          type="button"
          onClick={onToggleSound}
          className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition"
          style={{
            borderColor: soundEnabled
              ? "var(--color-text-accent)"
              : "var(--surface-card-border)",
            color: soundEnabled
              ? "var(--color-text-accent)"
              : "var(--color-text-secondary)",
            background: "var(--surface-card-bg)",
          }}
        >
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </div>
    </div>
  );
};


