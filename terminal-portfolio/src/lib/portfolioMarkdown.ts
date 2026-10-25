import {
  contactKindLabels,
  portfolioContent,
  portfolioSections,
  type PortfolioLink,
  type Project,
  type StoryChapter,
} from "@/config/portfolioContent";

/**
 * The whole portfolio as one Markdown document, for agents and LLM tools.
 * Served at /llms.txt, /llms-full.txt, /index.md, and at / when a client
 * asks for text/markdown. Everything the HTML page shows should be here.
 */
export const markdownPaths = {
  index: "/index.md",
  llms: "/llms.txt",
  llmsFull: "/llms-full.txt",
} as const;

const {
  siteUrl,
  identity,
  proofFacts,
  projects,
  skills,
  writing,
  story,
  contact,
  resume,
} = portfolioContent;

/** Use the same link label as the visible portfolio. */
const link = ({ label, prefix, href }: PortfolioLink) =>
  `[${prefix ?? label}](${href})`;

const linkLine = (item: PortfolioLink) => `- ${link(item)}`;

const section = (heading: string, lines: string[]) => [
  `## ${heading}`,
  "",
  ...lines,
];

const pageSection = (
  copy: { label: string; title: string; intro?: string },
  lines: string[],
) => section(copy.title, [
  ...(copy.intro ? [copy.intro, ""] : []),
  ...lines,
]);

const chapterLines = (chapter: StoryChapter) => [
  `### ${chapter.meta}: ${chapter.lead}`,
  "",
  chapter.body,
  "",
  ...(chapter.highlights?.length
    ? [...chapter.highlights.map((highlight) => `- ${highlight}`), ""]
    : []),
  ...chapter.roles.map((role) =>
    [
      `- ${role.title} · ${link(role.org)}`,
      role.partner ? ` × ${link(role.partner)}` : "",
      ` · ${role.dates}`,
      ...(role.links ?? []).map((item) => ` · ${link(item)}`),
    ].join(""),
  ),
  ...(chapter.roles.length ? [""] : []),
];

const projectLines = (project: Project) => [
  `### ${project.name}${project.status ? ` (${project.status.label})` : ""}`,
  "",
  project.summary,
  ...(project.description ? ["", project.description] : []),
  "",
  ...(project.stack.length
    ? [`- Technologies: ${project.stack.join(", ")}`]
    : []),
  ...(project.links ?? []).map(linkLine),
  "",
];

const byPlacement = (placement: Project["placement"]) =>
  projects.filter((project) => project.placement === placement);

export const portfolioMarkdown = [
  `# ${identity.name} (${identity.handle})`,
  "",
  `> ${identity.title}. ${contact.intro}`,
  "",
  `**${identity.headline}**`,
  "",
  identity.hero,
  "",
  identity.heroDetail,
  "",
  identity.personal,
  "",
  ...proofFacts.map((fact) => `- ${fact.label}: ${fact.value}`),
  "",
  ...pageSection(portfolioSections.story, story.chapters.flatMap(chapterLines)),
  ...pageSection(portfolioSections.work, byPlacement("selected").flatMap(projectLines)),
  ...section(
    "Additional projects",
    [...byPlacement("additional"), ...byPlacement("more")].flatMap(projectLines),
  ),
  ...pageSection(portfolioSections.thinking, story.thinking.flatMap((p) => [p, ""])),
  ...pageSection(portfolioSections.next, story.next.flatMap((p) => [p, ""])),
  ...pageSection(portfolioSections.focus, [
    ...skills.map(
      (group) =>
        `- ${group.title}: ${group.items.map((item) => item.label).join(", ")}`,
    ),
    "",
  ]),
  ...pageSection(
    portfolioSections.writing,
    writing.flatMap((item) => [
      `### ${item.title}`,
      "",
      `- ${item.meta}`,
      item.summary,
      "",
      ...item.links.map(linkLine),
      "",
    ]),
  ),
  ...pageSection(portfolioSections.research, byPlacement("research").flatMap(projectLines)),
  ...section("Contact", [
    contact.heading,
    "",
    story.contactInvite,
    "",
    contact.intro,
    "",
    ...contact.links.map(
      (item) => `- ${contactKindLabels[item.icon]}: ${link(item)}`,
    ),
    "",
  ]),
  ...section("Site", [
    `- Portfolio: [${siteUrl}/](${siteUrl}/)`,
    ...(resume.isPublished
      ? [`- Resume: [${siteUrl}${resume.pagePath}](${siteUrl}${resume.pagePath})`]
      : []),
    `- This document as Markdown: [${siteUrl}${markdownPaths.index}](${siteUrl}${markdownPaths.index}), [${siteUrl}${markdownPaths.llms}](${siteUrl}${markdownPaths.llms})`,
    "",
  ]),
].join("\n");

export const markdownResponse = (contentType: string) =>
  new Response(portfolioMarkdown, {
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Cache-Control": "public, max-age=0, must-revalidate",
      Vary: "Accept",
    },
  });
