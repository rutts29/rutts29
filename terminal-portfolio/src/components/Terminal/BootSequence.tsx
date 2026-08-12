import { portfolioContent } from "@/config/portfolioContent";

const BOOT_STEPS: Array<{ label: string; status: string }> = [
  { label: "portfolio.content", status: "loaded" },
  { label: "research.index", status: "ready" },
  { label: "project.records", status: "ready" },
  { label: "experience.timeline", status: "ready" },
  { label: "writing.index", status: "ready" },
  { label: "contact.routes", status: "ready" },
];

const ROW_BASE = 120;
const ROW_STEP = 150;
const IDENTITY_DELAY = ROW_BASE + BOOT_STEPS.length * ROW_STEP + 150;

const { identity } = portfolioContent;

export const BootSequence = () => {
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
        className="fade-up pt-4 font-mono text-sm sm:text-base"
        style={{ animationDelay: `${IDENTITY_DELAY}ms` }}
      >
        <span className="text-[var(--color-text-prompt)]">rutts@workspace</span>
        <span className="text-[var(--color-text-secondary)]">:~$ </span>
        <span className="text-[var(--color-text-accent)]">whoami</span>
      </div>

      <div className="fade-up" style={{ animationDelay: `${IDENTITY_DELAY + 180}ms` }}>
        <p className="chroma text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-[var(--color-text-primary)]">
          {identity.name}
        </p>
        <p className="mt-1.5 text-sm sm:text-base text-[var(--color-text-accent)]">
          {identity.title} · {identity.location}
        </p>
        <p className="mt-1.5 flex items-center text-sm sm:text-base text-[var(--color-text-secondary)]">
          {identity.hero}
          <span className="terminal-cursor ml-1.5" />
        </p>
      </div>
    </div>
  );
};
