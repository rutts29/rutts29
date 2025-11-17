"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollTimelineEntry } from "@/types/scroll";

type ScrollSectionsProps = {
  sections: ScrollTimelineEntry[];
  onTrigger: (entry: ScrollTimelineEntry) => void;
  initialTriggered?: string[];
};

export const ScrollSections = ({
  sections,
  onTrigger,
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
      // Slightly lower threshold so taller sections like "experience"
      // reliably register as visible and trigger their animations.
      { threshold: 0.25 },
    );

    orderedSections.forEach((section) => {
      const element = sectionRefs.current[section.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [onTrigger, orderedSections]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-16 py-20">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">
          Terminal showcase · commands unfold on scroll
        </p>
        <p className="text-[0.8rem] text-[var(--color-text-secondary)]">
          Watch each story block cue its terminal output as you move through the feed.
        </p>
      </div>
      <div className="space-y-24">
        {orderedSections.map((section) => {
          const hasTimeline = !!section.timeline && section.timeline.length > 0;
          const isCompact =
            section.id === "about" ||
            section.id === "projects" ||
            section.id === "contact";
          // Ensure timeline sections (experience) are always rendered
          // fully visible once they mount, even if the intersection
          // observer is finicky on some viewports.
          const isVisible = hasTimeline || visibleSections.has(section.id);
          const sectionPadding = isCompact ? "py-10" : "py-12";
          const contentSpacingClass =
            section.id === "contact"
              ? "space-y-1"
              : section.id === "projects"
              ? "space-y-1"
              : section.id === "about"
              ? "space-y-1.5"
              : "space-y-2";
          return (
        <section
          key={section.id}
          ref={(node) => {
            sectionRefs.current[section.id] = node;
          }}
          data-section-id={section.id}
              className={`mx-auto flex ${
                isCompact ? "min-h-[40vh]" : "min-h-[65vh]"
              } w-full max-w-4xl flex-col justify-center rounded-[2.5rem] border px-8 ${sectionPadding} text-left shadow-[0_25px_120px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
              style={{
                background: "var(--surface-card-bg)",
                borderColor: "var(--surface-card-border)",
              }}
            >
              <div className="mt-4 space-y-4">
                <div className="space-y-3">
                  <p className="font-mono text-sm uppercase tracking-[0.35em] text-[var(--color-text-accent)]">
                    $ {section.command}
                  </p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {section.summary}
          </p>
                </div>
                {section.timeline && section.timeline.length > 0 && (
                  <div className="mt-10 flex justify-center">
                    <div className="relative w-full max-w-2xl px-2 py-2 md:px-4 md:py-4">
                      <span className="pointer-events-none absolute left-1/2 top-6 bottom-2 w-px -translate-x-1/2 bg-[var(--surface-card-border)]" />
                      <div className="space-y-10">
                        {section.timeline.map((entry, index) => {
                          const showOnRight = index % 2 === 0;
                          return (
                            <div
                              key={`${entry.company}-${entry.role}`}
                              className="relative flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-6"
                            >
                              {/* Left side (desktop) */}
                              <div className="hidden text-left text-xs md:block" style={{ color: "var(--color-text-secondary)" }}>
                                {!showOnRight && (
                                  <div className="space-y-1">
                                    <p className="font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>
                                      {entry.role}
                                    </p>
                                    <p className="uppercase tracking-[0.35em]" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.duration}
                                    </p>
                                    <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.companyUrl ? (
                                        <>
                                          <a
                                            href={entry.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                            style={{ color: "var(--color-text-link)" }}
                                          >
                                            {entry.company}
                                          </a>
                                          {entry.partnerUrl && (
                                            <>
                                              {" & "}
                                              <a
                                                href={entry.partnerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                                style={{ color: "var(--color-text-link)" }}
                                              >
                                                Naryant
                                              </a>
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        entry.company
                                      )}
                                    </p>
                                    <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>{entry.location}</p>
                                    <ul className="list-disc pl-4" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.details.map((detail) => (
                                        <li key={detail} className="text-[0.8rem]">
                                          {detail}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              {/* Center dot */}
                              <div className="relative flex items-center justify-center">
                                <div
                                  className={`h-3 w-3 rounded-full border transition ${
                                    entry.isCurrent
                                      ? "animate-pulse"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor: entry.isCurrent ? "var(--color-text-accent)" : "var(--surface-card-bg)",
                                    borderColor: entry.isCurrent ? "var(--color-text-accent)" : "var(--surface-card-border)",
                                  }}
                                />
                              </div>
                              {/* Right side (desktop) */}
                              <div className="hidden text-left text-xs md:block" style={{ color: "var(--color-text-secondary)" }}>
                                {showOnRight && (
                                  <div className="space-y-1">
                                    <p className="font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>
                                      {entry.role}
                                    </p>
                                    <p className="uppercase tracking-[0.35em]" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.duration}
                                    </p>
                                    <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.companyUrl ? (
                                        <>
                                          <a
                                            href={entry.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                            style={{ color: "var(--color-text-link)" }}
                                          >
                                            {entry.company}
                                          </a>
                                          {entry.partnerUrl && (
                                            <>
                                              {" & "}
                                              <a
                                                href={entry.partnerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                                style={{ color: "var(--color-text-link)" }}
                                              >
                                                Naryant
                                              </a>
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        entry.company
                                      )}
                                    </p>
                                    <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>{entry.location}</p>
                                    <ul className="list-disc pl-4" style={{ color: "var(--color-text-secondary)" }}>
                                      {entry.details.map((detail) => (
                                        <li key={detail} className="text-[0.8rem]">
                                          {detail}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              {/* Mobile: full-width content under dot */}
                              <div className="mt-4 space-y-1 text-xs md:hidden" style={{ color: "var(--color-text-secondary)" }}>
                                <p className="font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>
                                  {entry.role}
                                </p>
                                <p className="uppercase tracking-[0.35em]" style={{ color: "var(--color-text-secondary)" }}>
                                  {entry.duration}
                                </p>
                                <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>
                                  {entry.companyUrl ? (
                                    <>
                                      <a
                                        href={entry.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                        style={{ color: "var(--color-text-link)" }}
                                      >
                                        {entry.company}
                                      </a>
                                      {entry.partnerUrl && (
                                        <>
                                          {" & "}
                                          <a
                                            href={entry.partnerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                            style={{ color: "var(--color-text-link)" }}
                                          >
                                            Naryant
                                          </a>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    entry.company
                                  )}
                                </p>
                                <p className="text-[0.75rem]" style={{ color: "var(--color-text-secondary)" }}>{entry.location}</p>
                                <ul className="list-disc pl-4" style={{ color: "var(--color-text-secondary)" }}>
                                  {entry.details.map((detail) => (
                                    <li key={detail} className="text-[0.8rem]">
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {section.iconGroups && (
                  <div className="mt-4 space-y-4">
                    {section.iconGroups.map((group) => (
                      <div
                        key={group.title}
                        className="flex flex-col gap-2 rounded-2xl border px-4 py-3"
                        style={{
                          borderColor: "var(--surface-card-border)",
                          background: "var(--surface-overlay-bg)",
                        }}
                      >
                        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">
                          {group.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {group.items.map((item) => (
                            item.badgeSrc ? (
                              <img
                                key={item.label}
                                src={item.badgeSrc}
                                alt={`${item.label} badge`}
                                className="h-6 w-auto rounded-md border border-[var(--surface-card-border)] bg-[var(--surface-panel-bg)]"
                                loading="lazy"
                              />
                            ) : (
                              <span
                                key={item.label}
                                className="flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em]"
                                style={{
                                  borderColor: "var(--surface-card-border)",
                                  background: "var(--surface-panel-bg)",
                                }}
                              >
                                {item.iconSrc && (
                                  <img
                                    src={item.iconSrc}
                                    alt={`${item.label} icon`}
                                    className="h-4 w-4"
                                    loading="lazy"
                                  />
                                )}
                                <span className="text-[var(--color-text-secondary)]">
                                  {item.label}
                                </span>
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.icons && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {section.icons.map((tech) => (
                      <span
                        key={tech.label}
                        className="flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em]"
                        style={{
                          borderColor: "var(--surface-card-border)",
                          background: "var(--surface-overlay-bg)",
                        }}
                      >
                        <img
                          src={tech.iconSrc}
                          alt={`${tech.label} icon`}
                          className="h-4 w-4"
                          loading="lazy"
                        />
                        <span className="text-[var(--color-text-secondary)]">
                          {tech.label}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                {section.content.length > 0 && !section.timeline && (
                  <div
                    className={`${contentSpacingClass} text-sm text-[var(--color-text-secondary)]`}
                  >
                    {section.content.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
        </section>
          );
        })}
      </div>
    </div>
  );
};

