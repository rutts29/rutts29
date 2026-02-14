"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
  const [scrollState, setScrollState] = useState(() => ({
    y: typeof window !== "undefined" ? window.scrollY : 0,
    viewportHeight:
      typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  const [parallaxReady, setParallaxReady] = useState(
    typeof window === "undefined",
  );
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  const orderedSections = useMemo(
    () => sections.map((section, index) => ({ ...section, order: index + 1 })),
    [sections],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let animationFrame: number | null = null;

    const updateScrollState = () => {
      setScrollState({
        y: window.scrollY,
        viewportHeight: window.innerHeight,
      });
    };

    const handleScroll = () => {
      if (animationFrame !== null) {
        return;
      }
      animationFrame = window.requestAnimationFrame(() => {
        updateScrollState();
        animationFrame = null;
      });
    };

    // Initialize immediately so returning visitors get parallax without refresh.
    updateScrollState();
    setParallaxReady(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

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
      // Use a generous rootMargin so tall sections (experience) animate sooner.
      { threshold: 0.1, rootMargin: "0px 0px 35% 0px" },
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
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl space-y-10 sm:space-y-12 md:space-y-16 py-10 sm:py-12 md:py-20 px-3 sm:px-4 md:px-0">
      <div className="space-y-16 sm:space-y-20 md:space-y-24">
        {orderedSections.map((section) => {
          const isCompact =
            section.id === "about" ||
            section.id === "skills" ||
            section.id === "experience" ||
            section.id === "projects" ||
            section.id === "contact";
          // Intersection observer handles reveal for every section (experience included)
          // thanks to the tuned threshold/rootMargin values above.
          const isVisible = visibleSections.has(section.id);
          const sectionPadding = isCompact ? "py-4 sm:py-6 md:py-8 lg:py-10" : "py-6 sm:py-8 md:py-10 lg:py-12";
          const contentSpacingClass =
            section.id === "contact" || section.id === "projects"
              ? "space-y-1"
              : section.id === "about"
              ? "space-y-1.5"
              : "space-y-2";

          const sectionNode = sectionRefs.current[section.id];
          const parallaxSpeed = 0.08 + section.order * 0.03;
          let parallaxOffset = 0;

          if (sectionNode && scrollState.viewportHeight) {
            const rect = sectionNode.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = scrollState.viewportHeight / 2;
            const distanceFromCenter = viewportCenter - sectionCenter;
            parallaxOffset = distanceFromCenter * parallaxSpeed;
          }

          const clampedOffset = Math.max(Math.min(parallaxOffset, 28), -28);
          const entranceOffset = isVisible ? 0 : 40;
          const parallaxContribution = parallaxReady ? clampedOffset : 0;
          const totalOffset = parallaxContribution + entranceOffset;

          return (
        <section
          key={section.id}
          ref={(node) => {
            sectionRefs.current[section.id] = node;
          }}
          data-section-id={section.id}
              className={`mx-auto flex ${
                section.id === "about" || section.id === "contact"
                  ? "min-h-0"
                  : isCompact
                    ? "min-h-[35vh] sm:min-h-[40vh]"
                    : "min-h-[50vh] sm:min-h-[65vh]"
              } w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl flex-col justify-center rounded-2xl sm:rounded-[2.5rem] border px-3 sm:px-4 md:px-6 lg:px-8 2xl:px-12 ${sectionPadding} text-left shadow-[0_25px_120px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: "var(--surface-card-bg)",
                borderColor: "var(--surface-card-border)",
                transform: `translate3d(0, ${totalOffset}px, 0)`,
                willChange: "transform, opacity",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <p className="font-mono text-xs sm:text-sm 2xl:text-base uppercase tracking-[0.35em] text-[var(--color-text-accent)]">
                    $ {section.command}
                  </p>
                </div>
                {section.timeline && section.timeline.length > 0 && (() => {
                  const active = section.timeline[activeTimelineIndex];
                  const n = section.timeline.length;
                  const halfItem = 100 / (2 * n);
                  const spanWidth = 100 - 2 * halfItem;
                  const progressWidth = n > 1
                    ? (activeTimelineIndex / (n - 1)) * spanWidth
                    : 0;
                  return (
                    <div className="mt-4 sm:mt-5 md:mt-6 w-full space-y-4">
                      {/* Horizontal timeline bar */}
                      <div className="relative w-full overflow-x-auto px-1 pb-2">
                        <div className="relative flex items-start justify-between min-w-0">
                          {/* Connecting line — gradient from accent to border, aligned to dot centers */}
                          <span
                            className="pointer-events-none absolute top-[7px] h-[2px] rounded-full"
                            style={{
                              left: `${halfItem}%`,
                              right: `${halfItem}%`,
                              background: `linear-gradient(to right, var(--color-text-accent), color-mix(in srgb, var(--color-text-accent) 30%, var(--surface-card-border)))`,
                              opacity: 0.6,
                            }}
                          />
                          {/* Progress fill up to active dot, aligned to dot centers */}
                          <span
                            className="pointer-events-none absolute top-[7px] h-[2px] rounded-full transition-all duration-500"
                            style={{
                              left: `${halfItem}%`,
                              width: `${progressWidth}%`,
                              background: "var(--color-text-accent)",
                              boxShadow: "0 0 6px color-mix(in srgb, var(--color-text-accent) 50%, transparent)",
                            }}
                          />
                          {section.timeline.map((entry, index) => {
                            const isActive = index === activeTimelineIndex;
                            const isPast = index <= activeTimelineIndex;
                            return (
                              <button
                                key={`${entry.company}-${entry.role}`}
                                type="button"
                                onClick={() => setActiveTimelineIndex(index)}
                                className="group relative z-10 flex flex-col items-center gap-2 px-1 sm:px-2 transition-all cursor-pointer"
                                style={{ flex: "1 1 0%", minWidth: 0 }}
                              >
                                {/* Dot */}
                                <div
                                  className={`h-4 w-4 shrink-0 rounded-full border-2 transition-all duration-300 ${
                                    entry.isCurrent && isActive ? "animate-pulse" : ""
                                  }`}
                                  style={{
                                    backgroundColor: isActive
                                      ? "var(--color-text-accent)"
                                      : isPast
                                      ? "color-mix(in srgb, var(--color-text-accent) 60%, var(--surface-card-bg))"
                                      : "var(--surface-card-bg)",
                                    borderColor: isActive
                                      ? "var(--color-text-accent)"
                                      : isPast
                                      ? "var(--color-text-accent)"
                                      : "var(--surface-card-border)",
                                    boxShadow: isActive
                                      ? "0 0 10px color-mix(in srgb, var(--color-text-accent) 50%, transparent)"
                                      : "none",
                                  }}
                                />
                                {/* Labels */}
                                <div className="flex flex-col items-center gap-0.5 w-full">
                                  <span
                                    className="text-xs sm:text-sm 2xl:text-base font-semibold leading-snug text-center w-full transition-colors"
                                    style={{
                                      color: isActive
                                        ? "var(--color-text-primary)"
                                        : "var(--color-text-secondary)",
                                    }}
                                  >
                                    {entry.company}
                                  </span>
                                  <span
                                    className="hidden sm:block text-[0.7rem] sm:text-xs 2xl:text-sm leading-snug text-center w-full transition-colors"
                                    style={{
                                      color: isActive
                                        ? "var(--color-text-secondary)"
                                        : "color-mix(in srgb, var(--color-text-secondary) 60%, transparent)",
                                    }}
                                  >
                                    {entry.role}
                                  </span>
                                  <span
                                    className="text-[0.6rem] sm:text-[0.7rem] 2xl:text-xs uppercase tracking-[0.15em] leading-snug text-center w-full transition-colors"
                                    style={{
                                      color: isActive
                                        ? "color-mix(in srgb, var(--color-text-accent) 80%, var(--color-text-secondary))"
                                        : "color-mix(in srgb, var(--color-text-secondary) 40%, transparent)",
                                    }}
                                  >
                                    {entry.duration.split("–")[0].trim()}–{entry.duration.split("–")[1]?.trim() || ""}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail panel */}
                      <div
                        className="rounded-2xl border px-4 py-4 sm:px-6 sm:py-5 space-y-3 transition-all"
                        style={{
                          borderColor: "var(--surface-card-border)",
                          background: "var(--surface-overlay-bg)",
                        }}
                      >
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base 2xl:text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            {active.role}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs 2xl:text-sm" style={{ color: "var(--color-text-secondary)" }}>
                            <span>
                              {active.companyUrl ? (
                                <a
                                  href={active.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                  style={{ color: "var(--color-text-link)" }}
                                >
                                  {active.company}
                                </a>
                              ) : (
                                active.company
                              )}
                              {active.partnerUrl && (
                                <>
                                  {" & "}
                                  <a
                                    href={active.partnerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    style={{ color: "var(--color-text-link)" }}
                                  >
                                    Naryant
                                  </a>
                                </>
                              )}
                            </span>
                            <span className="select-none" style={{ color: "var(--surface-card-border)" }}>|</span>
                            <span className="uppercase tracking-[0.25em]">{active.duration}</span>
                            <span className="select-none" style={{ color: "var(--surface-card-border)" }}>|</span>
                            <span>{active.location}</span>
                          </div>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm 2xl:text-base" style={{ color: "var(--color-text-secondary)" }}>
                          {active.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
                {section.projects && section.projects.length > 0 && (
                  <div className="mt-4 space-y-12">
                    {section.projects.map((project) => (
                      <div
                        key={project.name}
                        className="rounded-2xl border overflow-hidden"
                        style={{
                          borderColor: "var(--surface-card-border)",
                          background: "var(--surface-overlay-bg)",
                        }}
                      >
                        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm sm:text-base 2xl:text-lg font-semibold text-[var(--color-text-primary)]">
                              {project.name}
                            </p>
                            <div className="flex items-center gap-2">
                              {project.liveUrl && (
                                <>
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.25em] transition-colors hover:opacity-80"
                                    style={{
                                      borderColor: "var(--color-text-accent)",
                                      color: "var(--color-text-accent)",
                                    }}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    Live
                                  </a>
                                  <span className="text-xs select-none" style={{ color: "var(--surface-card-border)" }}>|</span>
                                </>
                              )}
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 transition-opacity hover:opacity-70"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                <span className="text-[0.65rem] uppercase tracking-[0.25em]">GitHub</span>
                              </a>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm 2xl:text-base text-[var(--color-text-secondary)]">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.25em]"
                                style={{
                                  borderColor: "var(--surface-card-border)",
                                  background: "var(--surface-panel-bg)",
                                  color: "var(--color-text-secondary)",
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        {project.image && (
                          <a
                            href={project.liveUrl || project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full overflow-hidden border-t transition-opacity hover:opacity-90"
                            style={{ borderColor: "var(--surface-card-border)" }}
                          >
                            <img
                              src={project.image}
                              alt={`${project.name} landing page`}
                              className="w-full h-auto max-h-[240px] sm:max-h-[280px] 2xl:max-h-[320px] object-cover object-top"
                              loading="lazy"
                            />
                          </a>
                        )}
                      </div>
                    ))}
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
                {section.contactLinks && section.contactLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {section.contactLinks.map((link) => {
                      const iconMap: Record<string, React.ReactNode> = {
                        email: (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        ),
                        linkedin: (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        ),
                        github: (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                          </svg>
                        ),
                        x: (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        ),
                        location: (
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        ),
                      };

                      const inner = (
                        <span className="inline-flex items-center gap-2 text-sm 2xl:text-base text-[var(--color-text-secondary)]">
                          <span className="text-[var(--color-text-accent)]">{iconMap[link.icon]}</span>
                          {link.label}
                        </span>
                      );

                      return link.href ? (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.icon === "email" ? undefined : "_blank"}
                          rel={link.icon === "email" ? undefined : "noopener noreferrer"}
                          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 sm:px-4 sm:py-2.5 transition-colors hover:bg-[var(--color-text-accent)]/10"
                          style={{ borderColor: "var(--surface-card-border)" }}
                        >
                          {inner}
                        </a>
                      ) : (
                        <span
                          key={link.label}
                          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 sm:px-4 sm:py-2.5"
                          style={{ borderColor: "var(--surface-card-border)" }}
                        >
                          {inner}
                        </span>
                      );
                    })}
                  </div>
                )}
                {section.content.length > 0 && !section.timeline && !section.contactLinks && (
                  <div
                    className={`${contentSpacingClass} text-sm 2xl:text-base text-[var(--color-text-secondary)]`}
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

