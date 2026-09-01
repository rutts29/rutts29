import { portfolioContent } from "@/config/portfolioContent";
import { themeNames } from "@/config/themes";
import type { CommandDefinition, TerminalLine } from "@/types/terminal";

export const commandCatalog: CommandDefinition[] = [
  { key: "help", description: "List available commands" },
  { key: "commands", description: "List available commands" },
  { key: "about", description: "Who I am and what I do" },
  { key: "education", description: "Degree and academic focus" },
  { key: "skills", description: "Technical skills and tools" },
  { key: "experience", description: "Roles and impact" },
  { key: "projects", description: "Applied AI systems, products, and research" },
  { key: "writing", description: "Publications and writing" },
  { key: "resume", description: "View or download my resume" },
  { key: "contact", description: "How to reach me" },
  { key: "theme list", description: "List terminal themes" },
  { key: "theme set <name>", description: "Switch the terminal theme" },
  { key: "clear", description: "Reset the terminal history" },
  { key: "history", description: "Show recent commands" },
  { key: "banner", description: "Print the ASCII welcome banner" },
];

const { identity, projects, skills, experience, writing, contact, resume } =
  portfolioContent;

const contactPrefix: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
};

const aboutLines: TerminalLine[] = [
  { type: "heading", text: "About" },
  ...[identity.hero, ...identity.about].map(
    (text, index): TerminalLine => ({
      type: "text",
      text,
      tone: index === 0 ? "default" : "muted",
    }),
  ),
];

const educationLines: TerminalLine[] = [
  { type: "heading", text: "Education" },
  { type: "text", text: identity.education.degree },
  {
    type: "text",
    text: identity.education.detail,
    tone: "muted",
  },
];

const skillsLines: TerminalLine[] = [
  { type: "heading", text: "Skills" },
  {
    type: "columns",
    columns: skills.map((group) => ({
      title: group.title,
      items: group.items.map((item) => item.label),
    })),
  },
];

const experienceLines: TerminalLine[] = [
  { type: "heading", text: "Experience" },
  ...experience.flatMap((role, index): TerminalLine[] => [
    ...(index > 0 ? [{ type: "spacer" as const }] : []),
    {
      type: "text",
      text: `${role.company.label} · ${role.role} · ${role.location}`,
      tone: "accent",
    },
    {
      type: "text",
      text: role.duration,
      tone: "muted",
    },
    { type: "list", items: role.details },
    {
      type: "link",
      label: role.company.href.replace(/^https?:\/\//, ""),
      href: role.company.href,
      prefix: role.company.label,
    },
    ...(role.unit
      ? [
          {
            type: "link" as const,
            label: role.unit.href.replace(/^https?:\/\//, ""),
            href: role.unit.href,
            prefix: role.unit.label,
          },
        ]
      : []),
    ...(role.partner
      ? [
          {
            type: "link" as const,
            label: role.partner.href.replace(/^https?:\/\//, ""),
            href: role.partner.href,
            prefix: `Industry partner: ${role.partner.label}`,
          },
        ]
      : []),
    ...(role.collaboratorNote
      ? [
          {
            type: "text" as const,
            text: role.collaboratorNote,
            tone: "muted" as const,
          },
        ]
      : []),
    ...(role.relatedLinks ?? []).map(
      (link): TerminalLine => ({
        type: "link",
        label: link.label,
        href: link.href,
        prefix: link.prefix,
      }),
    ),
  ]),
];

const projectEntryLines = (
  project: (typeof projects)[number],
  index: number,
): TerminalLine[] => [
  ...(index > 0 ? [{ type: "spacer" as const }] : []),
  { type: "text", text: project.name, tone: "accent" },
  { type: "text", text: project.summary },
  { type: "text", text: project.description, tone: "muted" },
  {
    type: "text",
    text: `Tools: ${project.stack.join(", ")}`,
    tone: "muted",
  },
  ...(project.links ?? []).map(
    (link): TerminalLine => ({
      type: "link",
      label: link.label,
      href: link.href,
      prefix: link.prefix,
    }),
  ),
];

const selectedProjects = projects.filter(
  (project) => project.placement === "selected",
);
const additionalProjects = projects.filter(
  (project) =>
    project.placement === "additional" || project.placement === "more",
);
const researchProjects = projects.filter(
  (project) => project.placement === "research",
);

const projectLines: TerminalLine[] = [
  { type: "heading", text: "Projects" },
  { type: "text", text: "Selected work", tone: "muted" },
  ...selectedProjects.flatMap(projectEntryLines),
  { type: "spacer" },
  { type: "text", text: "Additional projects", tone: "muted" },
  ...additionalProjects.flatMap(projectEntryLines),
  { type: "spacer" },
  { type: "text", text: "Research project", tone: "muted" },
  ...researchProjects.flatMap(projectEntryLines),
];

const writingLines: TerminalLine[] = [
  { type: "heading", text: "Publications & writing" },
  ...writing.flatMap((item, index): TerminalLine[] => [
    ...(index > 0 ? [{ type: "spacer" as const }] : []),
    { type: "text", text: item.title, tone: "accent" },
    ...(item.meta
      ? [{ type: "text" as const, text: item.meta, tone: "muted" as const }]
      : []),
    { type: "text", text: item.summary },
    ...(item.links ?? []).map(
      (link): TerminalLine => ({
        type: "link",
        label: link.label,
        href: link.href,
        prefix: link.prefix,
      }),
    ),
  ]),
];

const resumeLines: TerminalLine[] = [
  { type: "heading", text: resume.label },
  {
    type: "text",
    text: `${identity.name} · ${identity.title}`,
    tone: "muted",
  },
  {
    type: "link",
    label: "Open resume viewer",
    href: resume.pagePath,
    prefix: "View",
  },
  {
    type: "link",
    label: resume.downloadName,
    href: `${resume.documentPath}?download=1`,
    prefix: "Download",
  },
];

const contactLines: TerminalLine[] = [
  { type: "heading", text: "Contact" },
  { type: "text", text: contact.intro, tone: "muted" },
  ...contact.links.map(
    (link): TerminalLine => ({
      type: "link",
      label: link.label,
      href: link.href,
      prefix: contactPrefix[link.icon],
    }),
  ),
  {
    type: "text",
    text: contact.location,
    tone: "muted",
  },
  { type: "spacer" },
  {
    type: "link",
    label: contact.emailCta.label,
    href: contact.emailCta.mailto,
    prefix: "Email",
  },
];

export const staticCommandOutputs: Record<string, TerminalLine[]> = {
  banner: [
    {
      type: "ascii",
      lines: [
        "██████╗ ██╗   ██╗████████╗████████╗███████╗",
        "██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔════╝",
        "██████╔╝██║   ██║   ██║      ██║   ███████╗",
        "██╔══██╗██║   ██║   ██║      ██║   ╚════██║",
        "██║  ██║╚██████╔╝   ██║      ██║   ███████║",
        "╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚══════╝",
        "",
        "Welcome to Rutts' portfolio shell.",
      ],
    },
  ],
  welcome: [
    {
      type: "text",
      text: `Hi, I'm ${identity.shortName}. ${identity.title} · ${identity.location}.`,
      tone: "accent",
    },
    {
      type: "text",
      text: "Type a command to explore. Try about, projects, writing, or help.",
      tone: "muted",
    },
  ],
  about: aboutLines,
  education: educationLines,
  skills: skillsLines,
  experience: experienceLines,
  projects: projectLines,
  writing: writingLines,
  resume: resumeLines,
  contact: contactLines,
};

export const getHelpLines = (): TerminalLine[] => [
  { type: "heading", text: "Available Commands" },
  {
    type: "command-list",
    items: commandCatalog.map(({ key, description }) => ({
      command: key,
      description,
    })),
  },
];

export const getThemeListLines = (activeTheme?: string): TerminalLine[] => [
  { type: "heading", text: "Themes" },
  {
    type: "text",
    text: "Click a theme below, or type one of these commands.",
    tone: "muted",
  },
  {
    type: "command-list",
    items: themeNames.map((name) => ({
      command: `theme set ${name}`,
      description: name === activeTheme ? "Current theme" : `Switch to ${name}`,
    })),
  },
];

export const getInitialSystemOutputs = () => [
  staticCommandOutputs.banner,
  staticCommandOutputs.welcome,
];
