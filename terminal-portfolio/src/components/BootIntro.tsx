"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { text: "$ open 0xrutts.com", delay: 0 },
  { text: "  loading work, experience, skills", delay: 260 },
  { text: "  ✓ ready", delay: 560 },
] as const;

const EXIT_AT = 1050;
const DONE_AT = 1450;

/** Short terminal-style intro that plays once on load, then slides away. */
export function BootIntro() {
  const [phase, setPhase] = useState<"boot" | "exit" | "done">("boot");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const skip = () => setPhase("done");
    const exitTimer = window.setTimeout(
      () => setPhase("exit"),
      reduceMotion ? 0 : EXIT_AT,
    );
    const doneTimer = window.setTimeout(skip, reduceMotion ? 0 : DONE_AT);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`simple-boot${phase === "exit" ? " is-exiting" : ""}`}
      aria-hidden="true"
    >
      <div className="simple-boot-lines">
        {BOOT_LINES.map((line) => (
          <p key={line.text} style={{ animationDelay: `${line.delay}ms` }}>
            {line.text}
          </p>
        ))}
        <span className="simple-cursor" />
      </div>
    </div>
  );
}
