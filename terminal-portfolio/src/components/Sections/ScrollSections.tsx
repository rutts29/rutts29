"use client";

import { useEffect, useMemo, useRef } from "react";

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
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
        {disabled
          ? "Auto mode paused — interactive session active."
          : "Scroll timeline"}
      </p>
      {orderedSections.map((section) => (
        <section
          key={section.id}
          ref={(node) => {
            sectionRefs.current[section.id] = node;
          }}
          data-section-id={section.id}
          className="rounded-3xl border border-white/10 bg-black/30 px-5 py-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/30"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
            {String(section.order).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            {section.label}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {section.summary}
          </p>
          <p className="mt-4 text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-text-accent)]">
            auto › {section.command}
          </p>
        </section>
      ))}
    </div>
  );
};

