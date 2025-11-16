"use client";

import { TerminalMode } from "@/types/terminal";

type TopBarProps = {
  themeLabel: string;
  onCycleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  mode: TerminalMode;
  onModeChange: (mode: TerminalMode) => void;
};

export const TopBar = ({
  themeLabel,
  onCycleTheme,
  soundEnabled,
  onToggleSound,
  mode,
  onModeChange,
}: TopBarProps) => {
  const handleModeToggle = () => {
    onModeChange(mode === "interactive" ? "scrollAuto" : "interactive");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-lg">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          rutts@portfolio
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          AI Engineer • LLM Researcher
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onCycleTheme}
          className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)] transition hover:border-white/30 hover:text-[var(--color-text-primary)]"
        >
          Theme · {themeLabel}
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            soundEnabled
              ? "border-[var(--color-text-accent)] text-[var(--color-text-accent)]"
              : "border-white/15 text-[var(--color-text-secondary)]"
          }`}
        >
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
        <button
          type="button"
          onClick={handleModeToggle}
          className="rounded-full bg-[var(--color-button-bg)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-button-text)] transition hover:bg-[var(--color-button-hover)]"
        >
          {mode === "interactive" ? "Return to Story" : "Interactive Terminal"}
        </button>
      </div>
    </div>
  );
};

