"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollTimelineEntry } from "@/types/scroll";

type ScrollSectionsProps = {
  sections: ScrollTimelineEntry[];
  onTrigger: (entry: ScrollTimelineEntry) => void;
  disabled?: boolean;
  initialTriggered?: string[];
};

export const ScrollSections = ({
  sections,
  onTrigger,
  disabled,
  initialTriggered = [],
}: ScrollSectionsProps) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const triggeredRef = useRef(new Set(initialTriggered));
  const [visibleSections, setVisibleSections] = useState(
    new Set(initialTriggered),
  );

  const orderedSections = useMemo(
    () => sections.map((section, index) => ({ ...section, order: index + 1 })),
    [sections],
  );

  useEffect(() => {
    if (disabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section-id");
          if (!id || triggeredRef.current.has(id) || !entry.isIntersecting) {
            return;
          }
          const section = orderedSections.find((item) => item.id === id);
          if (section) {
            triggeredRef.current.add(id);
            setVisibleSections((prev) => {
              if (prev.has(id)) {
                return prev;
              }
              const next = new Set(prev);
              next.add(id);
              return next;
            });
            onTrigger(section);
          }
        });
      },
      { threshold: 0.55 },
    );

    orderedSections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [disabled, onTrigger, orderedSections]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-16 py-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">
          {disabled
            ? "Story mode paused — interactive terminal active"
            : "Story mode · scroll to unlock each command"}
        </p>
        {!disabled && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Each section cues the matching command and streams the output into
            the terminal.
          </p>
        )}
      </div>
      <div className="space-y-32">
        {orderedSections.map((section) => {
          const isVisible = visibleSections.has(section.id);
          return (
            <section
              key={section.id}
              ref={(node) => {
                sectionRefs.current[section.id] = node;
              }}
              data-section-id={section.id}
              className={`mx-auto flex min-h-[65vh] w-full max-w-4xl flex-col justify-center rounded-[2.5rem] border px-8 py-12 text-left shadow-[0_25px_120px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              } ${disabled ? "opacity-40" : ""}`}
              style={{
                background: "var(--surface-card-bg)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">
                {String(section.order).padStart(2, "0")} · {section.label}
              </p>
              <div className="mt-4 space-y-4">
                <p className="font-mono text-sm uppercase tracking-[0.35em] text-[var(--color-text-accent)]">
                  $ {section.command}
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                  {section.summary}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Scroll a bit further to see the output animate inside the
                  terminal window above.
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

