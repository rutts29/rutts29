import { portfolioContent } from "@/config/portfolioContent";
import { themeNames } from "@/config/themes";
import { CommandDefinition, TerminalLine } from "@/types/terminal";

/**
 * Terminal catalog + outputs derived from portfolioContent.
 * Autocomplete / help stay driven by commandCatalog.
 */

export const commandCatalog: CommandDefinition[] = [
  { key: "help", description: "List available commands" },
  { key: "about", description: "Who I am and what I do" },
  { key: "education", description: "Where I studied" },
  { key: "skills", description: "Stacks, languages, and systems I build with" },
  { key: "experience", description: "Roles and impact" },
  { key: "projects", description: "Featured and selected private work" },
  { key: "writing", description: "Publications and writing" },
  { key: "contact", description: "How to reach me" },
  { key: "theme set <name>", description: "Switch the terminal theme" },
  { key: "clear", description: "Reset the terminal history" },
  { key: "history", description: "Show recent commands" },
  { key: "banner", description: "Print the ASCII welcome banner" },
];

const { identity, publications, projects, skills, experience, writing, contact } =
  portfolioContent;

const aboutLines: TerminalLine[] = [
  { type: "heading", text: "About" },
  ...identity.about.map((text, index) => ({
    type: "text" as const,
    text,
    tone: index === 0 ? ("default" as const) : ("muted" as const),
  })),
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
  ...experience.flatMap((role, index) => {
    const header = `${role.company} — ${role.role} · ${role.location}`;
    const block: TerminalLine[] = [
      ...(index > 0 ? [{ type: "spacer" as const }] : []),
      { type: "text", text: header, tone: "accent" },
      {
        type: "text",
        text: role.duration + (role.isCurrent ? " · Current" : ""),
        tone: "muted",
      },
      { type: "list", items: role.details },
    ];
    return block;
  }),
];

const projectLines: TerminalLine[] = [
  { type: "heading", text: "Projects" },
  {
    type: "text",
    text: "Recent systems and prototypes. Most work is private.",
    tone: "muted",
  },
  ...projects.flatMap((project, index) => {
    const block: TerminalLine[] = [
      ...(index > 0 ? [{ type: "spacer" as const }] : []),
      {
        type: "text",
        text: `${project.name} — ${project.summary}`,
      },
      { type: "text", text: project.description, tone: "muted" },
      {
        type: "text",
        text: `Stack: ${project.stack.join(", ")}`,
        tone: "muted",
      },
      {
        type: "text",
        text: project.status,
        tone: "accent",
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
    return block;
  }),
];

const writingLines: TerminalLine[] = [
  { type: "heading", text: "Publications & writing" },
  ...writing.flatMap((item, index) => {
    const block: TerminalLine[] = [
      ...(index > 0 ? [{ type: "spacer" as const }] : []),
      {
        type: "text",
        text: item.title,
        tone: "accent",
      },
      {
        type: "text",
        text: item.meta ?? (item.status === "coming_soon" ? "Coming soon" : ""),
        tone: "muted",
      },
      { type: "text", text: item.summary },
    ];
    if (item.href) {
      const pub = publications.find(
        (p) =>
          item.status === "published" &&
          (item.id.includes("ieee") || p.title === item.title),
      );
      if (pub) {
        for (const link of pub.links) {
          block.push({
            type: "link",
            label: link.label,
            href: link.href,
            prefix: link.prefix,
          });
        }
      } else {
        block.push({
          type: "link",
          label: item.href.replace(/^https?:\/\//, ""),
          href: item.href,
          prefix: "Link",
        });
      }
    }
    return block;
  }),
];

const contactLines: TerminalLine[] = [
  { type: "heading", text: "Contact" },
  { type: "text", text: contact.intro, tone: "muted" },
  ...contact.links
    .filter((link) => link.href)
    .map(
      (link): TerminalLine => ({
        type: "link",
        label: link.label,
        href: link.href!,
        prefix:
          link.icon === "email"
            ? "Email"
            : link.icon === "linkedin"
              ? "LinkedIn"
              : link.icon === "github"
                ? "GitHub"
                : link.icon === "x"
                  ? "X"
                  : undefined,
      }),
    ),
  {
    type: "text",
    text:
      contact.links.find((link) => link.icon === "location")?.label ??
      identity.locationDetail,
    tone: "muted",
  },
  { type: "spacer" },
  {
    type: "link",
    label: contact.demoCta.label,
    href: contact.demoCta.mailto,
    prefix: "Email",
  },
  ...(contact.demoCta.note
    ? [
        {
          type: "text" as const,
          text: contact.demoCta.note,
          tone: "muted" as const,
        },
      ]
    : []),
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
        "Welcome to Rutts' live shell.",
      ],
    },
  ],
  welcome: [
    {
      type: "text",
      text: `yoo, I'm ${identity.shortName} (${identity.name.split(" ")[0]}) — ${identity.title} in Toronto.`,
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
  contact: contactLines,
};

export const getHelpLines = (): TerminalLine[] => [
  { type: "heading", text: "Available Commands" },
  {
    type: "list",
    items: commandCatalog.map(
      (command) => `${command.key.padEnd(16, " ")} — ${command.description}`,
    ),
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
    type: "list",
    items: themeNames.map(
      (name) =>
        `theme set ${name} — ${name === activeTheme ? `${name} (current)` : name}`,
    ),
  },
];

export const getInitialSystemOutputs = () => [
  staticCommandOutputs.banner,
  staticCommandOutputs.welcome,
];
