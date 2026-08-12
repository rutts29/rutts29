import { portfolioContent } from "@/config/portfolioContent";
import { ScrollTimelineEntry } from "@/types/scroll";

/**
 * Presentation adapter for the home portfolio (and legacy scroll sections).
 * All facts come from portfolioContent — do not duplicate copy here.
 */
export const scrollTimeline: ScrollTimelineEntry[] = [
  {
    id: "about",
    label: "About",
    command: "about",
    summary: "Get the quick story and focus areas.",
    content: portfolioContent.identity.about,
  },
  {
    id: "skills",
    label: "Skills",
    command: "skills",
    summary: "See the grouped stack behind the systems I build.",
    iconGroups: portfolioContent.skills,
    content: [],
  },
  {
    id: "experience",
    label: "Experience",
    command: "experience",
    summary: "Chronological roles and highlights.",
    timeline: portfolioContent.experience,
    content: [],
  },
  {
    id: "projects",
    label: "Projects",
    command: "projects",
    summary: "Selected builds with stack and status.",
    projects: portfolioContent.projects.map((project) => ({
      name: project.name,
      description: project.description,
      stack: project.stack,
      // Home UI treats empty repo as “no public source”.
      repoUrl: project.links?.find((link) => link.prefix === "Source")?.href ?? "",
      liveUrl: project.links?.find((link) => link.prefix === "Demo")?.href,
      image: project.image,
    })),
    content: [],
  },
  {
    id: "writing",
    label: "Writing",
    command: "writing",
    summary: "Publications and notes.",
    content: portfolioContent.writing.map((item) =>
      item.status === "published"
        ? `${item.title} — ${item.summary}`
        : `${item.title} (${item.meta ?? "coming soon"}) — ${item.summary}`,
    ),
  },
  {
    id: "contact",
    label: "Contact",
    command: "contact",
    summary: "Reach out via email or socials.",
    content: [],
    contactLinks: portfolioContent.contact.links,
  },
];
