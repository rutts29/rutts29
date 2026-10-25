"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, FileText } from "lucide-react";

import {
  contactKindLabels,
  portfolioContent,
  portfolioSections,
  type Project,
  type StoryChapter,
  type WritingItem,
} from "@/config/portfolioContent";
import { BootIntro } from "@/components/BootIntro";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { setThemePreference, useSimpleTheme } from "@/hooks/useSimpleTheme";

const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer noopener",
} as const;

/** Page sections in document order; drives the scroll cue and nav. */
const sections = [
  { id: "top", label: "Intro" },
  { id: "story", label: "Story" },
  { id: "work", label: "Work" },
  { id: "thinking", label: "Thinking" },
  { id: "next", label: "Next" },
  { id: "focus", label: "Skills" },
  { id: "writing", label: "Publications" },
  { id: "contact", label: "Contact" },
] as const;

type SectionId = (typeof sections)[number]["id"];

const sectionLabel = (id: SectionId) =>
  sections.find((section) => section.id === id)?.label ?? "Intro";

const {
  identity,
  proofFacts,
  projects,
  skills,
  writing,
  story,
  contact,
  resume,
} = portfolioContent;

const byPlacement = (placement: Project["placement"]) =>
  projects.filter((project) => project.placement === placement);

const selectedProjects = byPlacement("selected");
const additionalProjects = byPlacement("additional");
const moreProjects = byPlacement("more");
const researchProjects = byPlacement("research");

export function SimplePortfolio() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cueLabelRef = useRef<HTMLSpanElement>(null);
  const cuePctRef = useRef<HTMLSpanElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const theme = useSimpleTheme();

  /* Scroll reveal: hide only below-fold nodes, show them as they arrive. */
  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    portfolio.dataset.ready = "true";

    const items = () =>
      Array.from(portfolio.querySelectorAll<HTMLElement>(".simple-reveal"));
    // Keep `simple-reveal-pending`: it carries the transition. Removing it
    // on reveal would drop the transition and snap the item into place.
    const reveal = (item: HTMLElement) => item.classList.add("is-visible");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items().forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const fold = () => window.innerHeight * 0.95;

    items().forEach((item) => {
      if (item.getBoundingClientRect().top > fold()) {
        item.classList.add("simple-reveal-pending");
      } else {
        item.classList.add("is-visible");
      }
    });
    portfolio.dataset.motionReady = "true";

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

    // Belt and braces for fast scrolls or layout shifts the observer misses.
    const showNear = () => {
      const line = fold();
      items().forEach((item) => {
        if (item.classList.contains("is-visible")) return;
        if (item.getBoundingClientRect().top < line) reveal(item);
      });
    };

    window.addEventListener("scroll", showNear, { passive: true });
    window.addEventListener("resize", showNear);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", showNear);
      window.removeEventListener("resize", showNear);
    };
  }, []);

  /*
   * Page progress and the active-section cue. Targets are sampled on
   * scroll; a rAF loop eases towards them and writes straight to the DOM
   * so the bar never waits on a React render.
   */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let target = 0;
    let current = 0;
    let rafId = 0;
    let lastSection: SectionId = "top";

    const sample = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, window.scrollY / max) : 0;

      const marker = window.innerHeight * 0.28;
      let active: SectionId = "top";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= marker) active = section.id;
      }
      if (active !== lastSection) {
        lastSection = active;
        setActiveSection(active);
      }
    };

    const paint = () => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${current})`;
      }
      if (cuePctRef.current) {
        cuePctRef.current.textContent = `${Math.round(current * 100)}%`;
      }
      if (cueLabelRef.current) {
        cueLabelRef.current.textContent = sectionLabel(lastSection);
      }
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0008) current = target;
      paint();
      rafId = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      sample();
      if (reduceMotion) {
        current = target;
        paint();
        return;
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* Eased in-page jumps for nav and CTAs, offset for the sticky header. */
  useEffect(() => {
    const portfolio = portfolioRef.current;
    if (!portfolio) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let frameId = 0;

    const scrollToId = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const header = portfolio.querySelector<HTMLElement>(".simple-header");
      const headerH = header?.getBoundingClientRect().height ?? 64;
      const end = Math.max(
        0,
        window.scrollY + target.getBoundingClientRect().top - headerH - 12,
      );

      cancelAnimationFrame(frameId);
      if (reduceMotion) {
        window.scrollTo(0, end);
        return;
      }

      const start = window.scrollY;
      const distance = end - start;
      if (Math.abs(distance) < 2) return;

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
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href^='#']")
          : null;
      if (!anchor || !portfolio.contains(anchor)) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;

      event.preventDefault();
      const targetId = id === "main-content" ? "top" : id;
      scrollToId(targetId);
      // Home keeps a clean URL; other sections keep their hash.
      history.pushState(
        null,
        "",
        targetId === "top"
          ? window.location.pathname + window.location.search
          : `#${targetId}`,
      );
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
      <BootIntro />

      <div
        className="simple-scroll-progress"
        ref={progressBarRef}
        aria-hidden="true"
      />
      <div className="simple-scroll-cue" aria-live="polite">
        <span className="simple-scroll-cue-label" ref={cueLabelRef}>
          {sectionLabel(activeSection)}
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
              src="/icon.png"
              alt=""
              width={34}
              height={34}
              className="simple-wordmark-img"
              priority
            />
          </a>

          <nav className="simple-nav" aria-label="Primary navigation">
            <a href="#story" aria-current={activeSection === "story" ? "location" : undefined}>Story</a>
            <a href="#work" aria-current={activeSection === "work" ? "location" : undefined}>Work</a>
            <a href="#writing" aria-current={activeSection === "writing" ? "location" : undefined}>Publications</a>
            <a href="#contact" aria-current={activeSection === "contact" ? "location" : undefined}>Contact</a>
          </nav>

          <div className="simple-controls">
            <ThemeToggle
              theme={theme}
              onToggle={() =>
                setThemePreference(theme === "light" ? "dark" : "light")
              }
            />
            {resume.isPublished ? (
              <Link
                className="simple-btn-ghost"
                href={resume.pagePath}
                {...externalLinkProps}
              >
                <FileText aria-hidden="true" />
                <span>{resume.label}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="simple-shell simple-hero simple-reveal" id="top">
          <div className="simple-hero-copy">
            <p className="simple-label">{identity.title}</p>
            <h1 className="simple-display">{identity.name}</h1>
            <p className="simple-lede">
              <Headline text={identity.headline} />
              <span className="simple-cursor" aria-hidden="true" />
            </p>
            <p className="simple-body-copy">{identity.hero}</p>
            <p className="simple-body-copy">{identity.heroDetail}</p>
            <p className="simple-meta-line simple-hero-aside">
              {identity.personal}
            </p>
            <div className="simple-actions">
              <a className="simple-btn-primary" href="#work">
                Selected work
              </a>
              <a className="simple-btn-ghost" href="#contact">
                Get in touch
              </a>
              {resume.isPublished ? (
                <Link className="simple-btn-ghost" href={resume.pagePath} {...externalLinkProps}>
                  <FileText aria-hidden="true" />
                  {resume.label}
                </Link>
              ) : null}
            </div>
          </div>

          <dl className="simple-proof" aria-label="Snapshot">
            {proofFacts.map((fact) => (
              <div className="simple-proof-item" key={fact.label}>
                <dt className="simple-label">{fact.label}</dt>
                <dd className="simple-proof-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="simple-shell simple-section"
          id="story"
          aria-labelledby="story-title"
        >
          <SectionHead id="story-title" {...portfolioSections.story} />
          <div className="simple-list">
            {story.chapters.map((chapter) => (
              <ChapterRow key={chapter.meta} chapter={chapter} />
            ))}
          </div>
        </section>

        <section
          className="simple-shell simple-section"
          id="work"
          aria-labelledby="work-title"
        >
          <SectionHead
            id="work-title"
            {...portfolioSections.work}
          />

          <div className="simple-list">
            {selectedProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>

          {additionalProjects.length > 0 ? (
            <details className="simple-project-disclosure simple-reveal">
              <summary>
                <span className="simple-label">Additional projects</span>
                <span className="simple-disclosure-action">
                  <span className="simple-disclosure-closed">View projects</span>
                  <span className="simple-disclosure-open">Hide projects</span>
                  <ChevronDown aria-hidden="true" />
                </span>
              </summary>
              <div className="simple-disclosure-body">
                <div className="simple-list">
                  {additionalProjects.map((project) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      reveal={false}
                    />
                  ))}
                </div>

                {moreProjects.length > 0 ? (
                  <details className="simple-more-disclosure">
                    <summary>
                      <span>
                        <span className="simple-disclosure-more-closed">
                          View more
                        </span>
                        <span className="simple-disclosure-more-open">
                          Show less
                        </span>
                        <span className="simple-meta-line">
                          {moreProjects.map((project) => project.name).join(" and ")}
                        </span>
                      </span>
                      <ChevronDown aria-hidden="true" />
                    </summary>
                    <div className="simple-list simple-more-projects">
                      {moreProjects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          reveal={false}
                        />
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </details>
          ) : null}
        </section>

        <EssaySection
          id="thinking"
          {...portfolioSections.thinking}
          paragraphs={story.thinking}
        />
        <EssaySection
          id="next"
          {...portfolioSections.next}
          paragraphs={story.next}
        />

        <section
          className="simple-shell simple-section"
          id="focus"
          aria-labelledby="focus-title"
        >
          <SectionHead
            id="focus-title"
            {...portfolioSections.focus}
          />

          {skills.map((group) => (
            <article
              className="simple-skill-card simple-reveal"
              key={group.title}
            >
              <h3 className="simple-title">{group.title}</h3>
              <ul className="simple-badges" aria-label={`${group.title} tools`}>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Image
                      src={item.badgeSrc}
                      alt=""
                      aria-hidden="true"
                      width={item.badgeWidth}
                      height={20}
                      style={{ width: "auto", height: "30px" }}
                    />
                    <span className="sr-only">{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section
          className="simple-shell simple-section simple-publication-section"
          id="writing"
          aria-labelledby="writing-title"
        >
          <SectionHead
            id="writing-title"
            {...portfolioSections.writing}
          />
          <div className="simple-list">
            {writing.map((item) => (
              <WritingRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        {researchProjects.length > 0 ? (
          <section
            className="simple-shell simple-section simple-thesis-section"
            id="research"
            aria-labelledby="research-title"
          >
            <SectionHead
              id="research-title"
              {...portfolioSections.research}
            />
            <div className="simple-list">
              {researchProjects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="simple-shell simple-footer" id="contact">
        <div className="simple-reveal">
          <p className="simple-label">Contact</p>
          <h2 className="simple-heading">{contact.heading}</h2>
          <p className="simple-body-copy">{story.contactInvite}</p>
          <p className="simple-body-copy">{contact.intro}</p>
          <div className="simple-actions">
            <a className="simple-btn-primary" href={contact.emailCta.mailto}>
              {contact.emailCta.label}
            </a>
          </div>
        </div>
        <ul className="simple-contact simple-reveal">
          {contact.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.href.startsWith("http") ? externalLinkProps : {})}
              >
                <span className="simple-contact-main">
                  <span className="simple-contact-kind">
                    {contactKindLabels[link.icon]}
                  </span>
                  <span className="simple-contact-detail">{link.label}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="simple-meta-line simple-copyright">
          © {new Date().getFullYear()} {identity.name}
        </p>
      </footer>
    </div>
  );
}

/** Colours the first word of each sentence, like a highlighted keyword. */
function Headline({ text }: { text: string }) {
  return text.split(/(?<=\.)\s+/).map((sentence, index) => {
    const [first, ...rest] = sentence.split(" ");
    return (
      <span key={sentence}>
        {index > 0 ? " " : null}
        <span className={`simple-keyword-${index % 2}`}>{first}</span>{" "}
        {rest.join(" ")}
      </span>
    );
  });
}

function SectionHead({
  id,
  label,
  title,
  intro,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="simple-section-head simple-reveal">
      <p className="simple-label">{label}</p>
      <h2 id={id} className="simple-heading">
        {title}
      </h2>
      {intro ? <p className="simple-body-copy">{intro}</p> : null}
    </header>
  );
}

function EssaySection({
  id,
  label,
  title,
  paragraphs,
}: {
  id: SectionId;
  label: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <section
      className="simple-shell simple-section simple-essay"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <SectionHead id={`${id}-title`} label={label} title={title} />
      {paragraphs.map((paragraph) => (
        <p className="simple-lede simple-reveal" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} {...externalLinkProps}>
      {label}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function ChapterRow({ chapter }: { chapter: StoryChapter }) {
  return (
    <article className="simple-project simple-reveal">
      <p className="simple-meta-line">{chapter.meta}</p>
      <h3 className="simple-title simple-title-lg">{chapter.lead}</h3>
      <p className="simple-body-copy">{chapter.body}</p>
      {chapter.highlights?.length ? (
        <ul className="simple-story-highlights" aria-label="Selected contributions">
          {chapter.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
      {chapter.roles.length > 0 ? (
        <ul className="simple-roles" aria-label="Roles">
          {chapter.roles.map((role) => (
            <li key={`${role.title} ${role.dates}`}>
              <span className="simple-role-title">{role.title}</span>
              <span className="simple-role-sep">·</span>
              <a href={role.org.href} {...externalLinkProps}>
                {role.org.label}
              </a>
              {role.partner ? (
                <>
                  <span className="simple-role-sep">×</span>
                  <a href={role.partner.href} {...externalLinkProps}>
                    {role.partner.label}
                  </a>
                </>
              ) : null}
              <span className="simple-role-sep">·</span>
              <span className="simple-role-dates">{role.dates}</span>
              {role.links?.map((link) => (
                <span key={link.href}>
                  <span className="simple-role-sep">·</span>
                  <ExternalLink href={link.href} label={link.label} />
                </span>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <a className="simple-roles-link" href="#work">
          See the work below
        </a>
      )}
    </article>
  );
}

function ProjectRow({
  project,
  reveal = true,
}: {
  project: Project;
  reveal?: boolean;
}) {
  return (
    <article className={`simple-project${reveal ? " simple-reveal" : ""}`}>
      <p className="simple-meta-line">~/work/{project.id}</p>
      <div className="simple-project-top">
        <h3 className="simple-title simple-title-lg">{project.name}</h3>
        {project.status ? (
          <span className="simple-pill" data-tone={project.status.tone}>
            {project.status.label}
          </span>
        ) : null}
      </div>
      <p className="simple-outcome">{project.summary}</p>
      {project.description ? (
        <p className="simple-body-copy">{project.description}</p>
      ) : null}
      <div className="simple-project-foot">
        {project.stack.length > 0 ? (
          <ul className="simple-chips" aria-label={`${project.name} technologies`}>
            {project.stack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        ) : null}
        {project.links?.length ? (
          <div className="simple-inline-links">
            {project.links.map((link) => (
              <ExternalLink
                key={link.href}
                href={link.href}
                label={link.prefix ?? link.label}
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function WritingRow({ item }: { item: WritingItem }) {
  return (
    <article className="simple-project simple-reveal">
      <p className="simple-meta-line">{item.meta}</p>
      <h3 className="simple-title simple-title-lg">{item.title}</h3>
      <p className="simple-body-copy">{item.summary}</p>
      <div className="simple-project-foot">
        <div className="simple-inline-links">
          {item.links.map((link) => (
            <ExternalLink
              key={link.href}
              href={link.href}
              label={link.prefix ?? link.label}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
