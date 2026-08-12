"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, SquareTerminal } from "lucide-react";

import {
  formatOrganizationNames,
  portfolioContent,
  type Project,
} from "@/config/portfolioContent";
import { ThemeToggle, type ResolvedTheme } from "@/components/UI/ThemeToggle";

type ThemePreference = ResolvedTheme | "system";

const themeStorageKey = "simple-portfolio-theme";
const themeEventName = "simple-portfolio-theme-change";

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

const getThemeSnapshot = (): ThemePreference => {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return isThemePreference(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
};

const getResolvedThemeSnapshot = (): ResolvedTheme => {
  const preference = getThemeSnapshot();
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getServerResolvedThemeSnapshot = (): ResolvedTheme => "light";

const subscribeToTheme = (onChange: () => void) => {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  window.addEventListener(themeEventName, onChange);
  colorScheme.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(themeEventName, onChange);
    colorScheme.removeEventListener("change", onChange);
  };
};

const setThemePreference = (theme: ResolvedTheme) => {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    /* private mode */
  }

  document.documentElement.dataset.simpleTheme = theme;
  document.documentElement.dataset.simpleResolved = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event(themeEventName));
};

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer noopener",
} as const;

const contactLabels: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

const sectionMeta = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "focus", label: "Skills" },
  { id: "writing", label: "Publications" },
  { id: "contact", label: "Contact" },
] as const;

function parseLocation(location: string) {
  const parts = location.split("·").map((part) => part.trim());
  if (parts.length < 2) return { type: location, place: "" };
  return { type: parts[0], place: parts.slice(1).join(" · ") };
}

function formatLead(detail: string) {
  const cleaned = detail.replace(/https?:\/\/\S+/g, "").trim();
  return cleaned.replace(/\s+/g, " ").replace(/[.:]+$/, "");
}

function yearsInDuration(duration: string): number[] {
  return [...duration.matchAll(/\b(20\d{2})\b/g)].map((m) => Number(m[1]));
}

function startYear(duration: string): number {
  const years = yearsInDuration(duration);
  return years[0] ?? new Date().getFullYear();
}

function buildYearTrack(durations: string[]): number[] {
  const years = durations.flatMap(yearsInDuration);
  if (years.length === 0) {
    const y = new Date().getFullYear();
    return [y - 2, y - 1, y];
  }
  const min = Math.min(...years);
  const max = Math.max(...years, new Date().getFullYear());
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

export function SimplePortfolio() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cueLabelRef = useRef<HTMLSpanElement>(null);
  const cuePctRef = useRef<HTMLSpanElement>(null);
  const [activeSection, setActiveSection] = useState("top");
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getResolvedThemeSnapshot,
    getServerResolvedThemeSnapshot,
  );

  const {
    identity,
    proofFacts,
    projects,
    skills,
    experience,
    writing,
    contact,
  } = portfolioContent;
  const featured = projects.filter((project) => project.featured);
  const secondary = projects.filter((project) => !project.featured);
  const activeLabel =
    sectionMeta.find((s) => s.id === activeSection)?.label ?? "Intro";
  const yearTrack = buildYearTrack(experience.map((role) => role.duration));

  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    /* Mark hydrated chrome (progress / section cue) */
    portfolio.dataset.ready = "true";

    const items = () =>
      Array.from(portfolio.querySelectorAll<HTMLElement>(".simple-reveal"));

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      items().forEach((item) => {
        item.classList.remove("simple-reveal-pending");
        item.classList.add("is-visible");
      });
      return;
    }

    const fold = () => window.innerHeight * 0.95;

    /* Only below-fold nodes may hide — never blank the first paint */
    items().forEach((item) => {
      if (item.getBoundingClientRect().top > fold()) {
        item.classList.add("simple-reveal-pending");
      } else {
        item.classList.add("is-visible");
      }
    });
    portfolio.dataset.motionReady = "true";

    const reveal = (item: HTMLElement) => {
      item.classList.add("is-visible");
      item.classList.remove("simple-reveal-pending");
    };

    const showNear = () => {
      const line = fold();
      items().forEach((item) => {
        if (item.classList.contains("is-visible")) return;
        if (item.getBoundingClientRect().top < line) reveal(item);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.05 },
    );

    items().forEach((item) => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });

    window.addEventListener("scroll", showNear, { passive: true });
    window.addEventListener("resize", showNear);

    const failSafe = window.setTimeout(() => {
      items().forEach((item) => reveal(item));
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
      window.removeEventListener("scroll", showNear);
      window.removeEventListener("resize", showNear);
    };
  }, []);

  /*
   * Scroll-linked UI (page progress + trajectory rail).
   * Targets update on scroll; rAF lerps values and writes to the DOM so the
   * rail doesn't hitch on React re-renders.
   */
  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let targetPage = 0;
    let currentPage = 0;
    let targetTimeline = 0;
    let currentTimeline = 0;
    let rafId = 0;
    let ticking = false;
    let lastSection = "top";
    let lastYearsKey = "";

    const sampleTargets = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      targetPage = max > 0 ? Math.min(1, window.scrollY / max) : 0;

      const marker = window.innerHeight * 0.28;
      let current = "top";
      for (const section of sectionMeta) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = section.id;
      }
      if (current !== lastSection) {
        lastSection = current;
        setActiveSection(current);
      }

      const timeline = timelineRef.current;
      if (!timeline) return;

      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const focus = vh * 0.42;
      const span = Math.max(1, rect.bottom - rect.top);
      targetTimeline = Math.min(1, Math.max(0, (focus - rect.top) / span));
    };

    const applyTimelineNodes = (progress: number) => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const rect = timeline.getBoundingClientRect();
      const fillY = rect.top + rect.height * progress;
      const years = new Set<number>();

      timeline.querySelectorAll<HTMLElement>(".simple-timeline-item").forEach((item) => {
        const node = item.querySelector(".simple-timeline-node");
        if (!(node instanceof HTMLElement)) return;
        const nodeRect = node.getBoundingClientRect();
        const mid = nodeRect.top + nodeRect.height / 2;
        const reached = mid <= fillY + 8;
        item.classList.toggle("is-reached", reached);
        node.classList.toggle("is-active", reached);
        if (reached) {
          const y = Number(item.dataset.year);
          if (!Number.isNaN(y)) years.add(y);
        }
      });

      const yearsKey = [...years].sort((a, b) => a - b).join(",");
      if (yearsKey !== lastYearsKey) {
        lastYearsKey = yearsKey;
        portfolio.querySelectorAll<HTMLElement>(".simple-year-tick").forEach((tick) => {
          const y = Number(tick.dataset.year);
          tick.classList.toggle("is-active", years.has(y));
        });
      }
    };

    const paint = () => {
      portfolio.style.setProperty("--scroll", String(currentPage));
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentPage})`;
      }
      if (cuePctRef.current) {
        cuePctRef.current.textContent = `${Math.round(currentPage * 100)}%`;
      }
      if (cueLabelRef.current) {
        const label =
          sectionMeta.find((s) => s.id === lastSection)?.label ?? "Intro";
        if (cueLabelRef.current.textContent !== label) {
          cueLabelRef.current.textContent = label;
        }
      }

      const timeline = timelineRef.current;
      if (timeline) {
        timeline.style.setProperty(
          "--timeline-progress",
          String(currentTimeline),
        );
        applyTimelineNodes(currentTimeline);
      }
    };

    const tick = () => {
      const ease = reduceMotion ? 1 : 0.16;
      currentPage += (targetPage - currentPage) * ease;
      currentTimeline += (targetTimeline - currentTimeline) * ease;

      if (Math.abs(targetPage - currentPage) < 0.0008) currentPage = targetPage;
      if (Math.abs(targetTimeline - currentTimeline) < 0.0008) {
        currentTimeline = targetTimeline;
      }

      paint();

      const settled =
        currentPage === targetPage && currentTimeline === targetTimeline;
      if (settled) {
        ticking = false;
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const kick = () => {
      sampleTargets();
      if (reduceMotion) {
        currentPage = targetPage;
        currentTimeline = targetTimeline;
        paint();
        return;
      }
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* Smooth section jumps (nav, Get in touch, CTAs) — eased, sticky-aware */
  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* Ease-out: moves immediately on click (no slow “wind-up”), soft landing */
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let frameId = 0;

    const scrollToId = (id: string) => {
      const target =
        id === "top" || id === ""
          ? (document.getElementById("top") ?? portfolio)
          : document.getElementById(id);
      if (!target) return;

      const header = portfolio.querySelector(".simple-header");
      const headerH =
        header instanceof HTMLElement
          ? header.getBoundingClientRect().height
          : 64;
      const top =
        window.scrollY +
        target.getBoundingClientRect().top -
        headerH -
        12;

      cancelAnimationFrame(frameId);

      if (reduceMotion) {
        window.scrollTo(0, Math.max(0, top));
        return;
      }

      const start = window.scrollY;
      const end = Math.max(0, top);
      const distance = end - start;
      if (Math.abs(distance) < 2) return;

      /* Same smooth length as before — delay was easing, not duration */
      const duration = Math.min(900, Math.max(420, Math.abs(distance) * 0.48));
      const startTime = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        window.scrollTo(0, start + distance * easeOutCubic(t));
        if (t < 1) frameId = requestAnimationFrame(step);
      };

      frameId = requestAnimationFrame(step);
    };

    const onClick = (event: MouseEvent) => {
      const el = event.target;
      if (!(el instanceof Element)) return;
      const anchor = el.closest("a[href^='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!portfolio.contains(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      if (!id) return;
      // Skip links that aren't in-page sections we own
      if (
        id !== "main-content" &&
        !document.getElementById(id) &&
        id !== "top"
      ) {
        return;
      }

      event.preventDefault();
      const targetId = id === "main-content" ? "top" : id;
      scrollToId(targetId);
      /* Home/image → clean URL, no #top. Other sections keep their hash. */
      if (targetId === "top") {
        history.pushState(null, "", window.location.pathname + window.location.search);
      } else {
        history.pushState(null, "", href);
      }
    };

    portfolio.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frameId);
      portfolio.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      className="simple-portfolio"
      data-theme={theme}
      ref={portfolioRef}
      suppressHydrationWarning
    >
        <div className="simple-atmosphere" aria-hidden="true">
          <div className="simple-paper" />
          <div className="simple-band" />
          <div className="simple-ink simple-ink-a" />
          <div className="simple-ink simple-ink-b" />
          <div className="simple-ink simple-ink-c" />
          <div className="simple-ink simple-ink-d" />
          <div className="simple-speckle" />
          <p className="simple-watermark simple-watermark-main">R</p>
          <p className="simple-watermark simple-watermark-sub">AI · ML</p>
          <div className="simple-atmosphere-grain" />
          <div className="simple-atmosphere-fiber" />
        </div>

        {/* Quiet scroll cues — holds a 30–60s skim without a full HUD */}
        <div
          className="simple-scroll-progress"
          ref={progressBarRef}
          aria-hidden="true"
        />
        <div className="simple-scroll-cue" aria-live="polite">
          <span className="simple-scroll-cue-label" ref={cueLabelRef}>
            {activeLabel}
          </span>
          <span className="simple-scroll-cue-pct" ref={cuePctRef}>
            0%
          </span>
        </div>

        <a className="simple-skip-link" href="#main-content">
          Skip to content
        </a>

        <header className="simple-header">
          <div className="simple-shell simple-header-inner">
            <a
              className="simple-wordmark"
              href="#top"
              aria-label={`${identity.name}, home`}
            >
              <Image
                src="/core-image.jpg"
                alt=""
                width={34}
                height={34}
                className="simple-wordmark-img"
                priority
              />
            </a>

            <nav className="simple-nav" aria-label="Primary navigation">
              <a href="#work">Work</a>
              <a href="#experience">Experience</a>
              <a href="#writing">Publications</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="simple-controls">
              <ThemeToggle
                theme={theme}
                onToggle={() =>
                  setThemePreference(theme === "light" ? "dark" : "light")
                }
              />
              <Link className="simple-interactive" href="/interactive">
                <SquareTerminal aria-hidden="true" />
                <span>Terminal</span>
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content">
          <section className="simple-shell simple-hero simple-reveal" id="top">
            <div className="simple-hero-copy">
              <div className="simple-kicker">
                <p className="simple-label">{identity.title}</p>
                <p className="simple-location">
                  <MapPin aria-hidden="true" />
                  {identity.location}
                </p>
              </div>
              <h1 className="simple-display">{identity.name}</h1>
              <p className="simple-lede">{identity.hero}</p>
              <p className="simple-body-copy">{identity.summary}</p>
              <div className="simple-actions">
                <a className="simple-btn-primary" href="#work">
                  Selected work
                </a>
                <a className="simple-btn-ghost" href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
            <div className="simple-hero-portrait">
              <Image
                src="/core-image.jpg"
                alt={identity.name}
                width={320}
                height={320}
                priority
                sizes="(max-width: 760px) 160px, 280px"
              />
            </div>
          </section>

          {/* Fact strip — scannable proof while they scroll the first screen */}
          <section
            className="simple-shell simple-proof simple-reveal"
            aria-label="Snapshot"
          >
            {proofFacts.map((fact) => (
              <div className="simple-proof-item" key={fact.label}>
                <p className="simple-label">{fact.label}</p>
                <p className="simple-proof-value">{fact.value}</p>
              </div>
            ))}
          </section>

          <section
            className="simple-shell simple-section"
            id="work"
            aria-labelledby="work-title"
          >
            <header className="simple-section-head simple-reveal">
              <p className="simple-label">Selected work</p>
              <h2 id="work-title" className="simple-heading">
                AI systems and research
              </h2>
              <p className="simple-body-copy">
                Observability, agent infrastructure, security, and applied ML.
              </p>
            </header>

            <div className="simple-list">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {secondary.length > 0 ? (
              <>
                <header className="simple-section-head simple-reveal" style={{ marginTop: "2rem" }}>
                  <p className="simple-label">Additional work</p>
                  <h3 className="simple-title simple-title-lg">
                    Products and infrastructure
                  </h3>
                </header>
                <div className="simple-list">
                  {secondary.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            ) : null}
          </section>

          <section
            className="simple-shell simple-section"
            id="experience"
            aria-labelledby="experience-title"
          >
            <header className="simple-section-head simple-reveal">
              <p className="simple-label">Experience</p>
              <h2 id="experience-title" className="simple-heading">
                Research and engineering roles
              </h2>
              <p className="simple-body-copy">
                Applied AI, ML research, and product work across industry and academic collaborations.
              </p>
            </header>

            <div
              className="simple-year-track simple-reveal"
              aria-label="Years of experience"
            >
              {yearTrack.map((year) => (
                <span
                  className="simple-year-tick"
                  data-year={year}
                  key={year}
                >
                  {year}
                </span>
              ))}
            </div>

            <div className="simple-timeline" ref={timelineRef}>
              <div className="simple-timeline-rail" aria-hidden="true">
                <div className="simple-timeline-rail-fill" />
              </div>
              <ol className="simple-timeline-list">
                {experience.map((role) => {
                  const { type, place } = parseLocation(role.location);
                  const lead = role.details[0]
                    ? formatLead(role.details[0])
                    : "";
                  const year = startYear(role.duration);
                  return (
                    <li
                      className="simple-timeline-item simple-reveal"
                      data-year={year}
                      key={`${formatOrganizationNames(role.organizations)}-${role.role}-${role.duration}`}
                    >
                      <span className="simple-timeline-year" aria-hidden="true">
                        {year}
                      </span>
                      <span className="simple-timeline-node" aria-hidden="true" />
                      <div className="simple-timeline-card">
                        <div className="simple-role-head">
                          <div className="simple-role-title-line">
                            <h3 className="simple-title">{role.role}</h3>
                            <p className="simple-meta-line">{role.duration}</p>
                          </div>
                          <p className="simple-meta-line">
                            <span className="simple-company-links">
                              {role.organizations.map((organization, index) => (
                                <Fragment key={organization.href}>
                                  {index > 0 ? " & " : null}
                                  <a
                                    href={organization.href}
                                    {...externalLinkProps}
                                  >
                                    {organization.label}
                                  </a>
                                </Fragment>
                              ))}
                            </span>
                            <span className="simple-dot" aria-hidden="true">
                              ·
                            </span>
                            <span>{type}</span>
                            {place ? (
                              <>
                                <span className="simple-dot" aria-hidden="true">
                                  ·
                                </span>
                                <span>{place}</span>
                              </>
                            ) : null}
                            {role.isCurrent ? (
                              <span className="simple-pill">Current</span>
                            ) : null}
                          </p>
                        </div>
                        {lead ? <p className="simple-outcome">{lead}</p> : null}
                        <ul className="simple-bullets">
                          {role.details.slice(1, 3).map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                        {role.relatedLinks && role.relatedLinks.length > 0 ? (
                          <div className="simple-inline-links simple-role-links">
                            {role.relatedLinks.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                {...externalLinkProps}
                              >
                                {link.prefix ?? link.label}
                                <ArrowUpRight aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section
            className="simple-shell simple-section"
            id="focus"
            aria-labelledby="focus-title"
          >
            <header className="simple-section-head simple-reveal">
              <p className="simple-label">Skills</p>
              <h2 id="focus-title" className="simple-heading">
                Core tools
              </h2>
              <p className="simple-body-copy">
                The languages, frameworks, and infrastructure I use most.
              </p>
            </header>

            <div className="simple-skill-grid">
              {skills.map((group) => (
                <article
                  className="simple-skill-card simple-reveal"
                  key={group.title}
                >
                  <h3 className="simple-title">{group.title}</h3>
                  <ul
                    className="simple-badges"
                    aria-label={`${group.title} tools`}
                  >
                    {group.items.map((item) =>
                      item.badgeSrc ? (
                        <li key={item.label}>
                          <Image
                            src={item.badgeSrc}
                            alt={item.label}
                            width={120}
                            height={28}
                          />
                        </li>
                      ) : null,
                    )}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            className="simple-shell simple-section"
            id="writing"
            aria-labelledby="writing-title"
          >
            <header className="simple-section-head simple-reveal">
              <p className="simple-label">Publications &amp; writing</p>
              <h2 id="writing-title" className="simple-heading">
                Published results and system notes
              </h2>
              <p className="simple-body-copy">
                An IEEE conference paper, with concise articles on AI systems,
                evaluation, and security to follow.
              </p>
            </header>

            <div className="simple-list">
              {writing.map((item) => (
                <article
                  className="simple-project simple-reveal"
                  key={item.id}
                >
                  <div className="simple-project-top">
                    <h3 className="simple-title simple-title-lg">
                      {item.title}
                    </h3>
                    {item.links && item.links.length > 0 ? (
                      <div className="simple-inline-links">
                        {item.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            {...externalLinkProps}
                          >
                            {link.prefix ?? "Link"}
                            <ArrowUpRight aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {item.meta ? (
                    <p className="simple-outcome">{item.meta}</p>
                  ) : null}
                  <p className="simple-body-copy">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="simple-shell simple-footer" id="contact">
          <div className="simple-reveal">
            <p className="simple-label">Contact</p>
            <h2 className="simple-heading">{contact.heading}</h2>
            <p className="simple-body-copy">{contact.intro}</p>
            <div className="simple-actions" style={{ marginTop: "1.25rem" }}>
              <a className="simple-btn-primary" href={contact.demoCta.mailto}>
                {contact.demoCta.label}
              </a>
            </div>
          </div>
          <ul className="simple-contact simple-reveal">
            {contact.links.map((link) => {
              const isMail = link.href.startsWith("mailto:");
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(isMail || !link.href.startsWith("http")
                      ? {}
                      : externalLinkProps)}
                  >
                    <span className="simple-contact-main">
                      <span className="simple-contact-kind">
                        {contactLabels[link.icon] ?? link.label}
                      </span>
                      <span className="simple-contact-detail">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="simple-meta-line simple-copyright">
            © {new Date().getFullYear()} {identity.name}
          </p>
        </footer>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="simple-project simple-reveal">
      <div className="simple-project-top">
        <h3 className="simple-title simple-title-lg">{project.name}</h3>
      </div>
      <p className="simple-outcome">{project.summary}</p>
      <p className="simple-body-copy">{project.description}</p>
      <ul className="simple-chips" aria-label={`${project.name} technologies`}>
        {project.stack.slice(0, 5).map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </article>
  );
}
