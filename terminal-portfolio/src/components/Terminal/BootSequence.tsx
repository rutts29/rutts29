"use client";

import { useEffect } from "react";

type BootSequenceProps = {
  onDone?: () => void;
};

const BOOT_STEPS: Array<{ label: string; status: string }> = [
  { label: "rutts.runtime", status: "init" },
  { label: "agentic core", status: "online" },
  { label: "code-intel modules", status: "mounted" },
  { label: "retrieval + vectors", status: "ready" },
  { label: "inference pipelines", status: "stable" },
  { label: "security sandbox", status: "armed" },
];

const ROW_BASE = 120;
const ROW_STEP = 150;
const IDENTITY_DELAY = ROW_BASE + BOOT_STEPS.length * ROW_STEP + 150;
const DONE_DELAY = IDENTITY_DELAY + 650;

export const BootSequence = ({ onDone }: BootSequenceProps) => {
  useEffect(() => {
    if (!onDone) {
      return;
    }
    const timeout = setTimeout(onDone, DONE_DELAY);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <div className="space-y-1.5">
      {BOOT_STEPS.map((step, index) => (
        <div
          key={step.label}
          className="boot-row"
          style={{ animationDelay: `${ROW_BASE + index * ROW_STEP}ms` }}
        >
          <span className="boot-label">{step.label}</span>
          <span className="boot-leader" />
          <span className="boot-ok">{step.status} ✓</span>
        </div>
      ))}

      <div
        className="fade-up pt-4 font-mono text-xs sm:text-sm"
        style={{ animationDelay: `${IDENTITY_DELAY}ms` }}
      >
        <span className="text-[var(--color-text-prompt)]">rutts@workspace</span>
        <span className="text-[var(--color-text-secondary)]">:~$ </span>
        <span className="text-[var(--color-text-accent)]">whoami</span>
      </div>

      <div className="fade-up" style={{ animationDelay: `${IDENTITY_DELAY + 180}ms` }}>
        <p className="chroma text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-[var(--color-text-primary)]">
          Ruttansh Bhatelia
        </p>
        <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-accent)]">
          AI Engineer · ML Researcher — Toronto
        </p>
        <p className="mt-1 flex items-center text-xs sm:text-sm text-[var(--color-text-secondary)]">
          building agentic systems &amp; code intelligence that ship.
          <span className="terminal-cursor ml-1.5" />
        </p>
      </div>
    </div>
  );
};
