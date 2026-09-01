import { portfolioContent } from "@/config/portfolioContent";

export const dynamic = "force-static";

const lines = (() => {
  const {
    siteUrl,
    identity,
    projects,
    skills,
    experience,
    writing,
    contact,
    resume,
  } = portfolioContent;
  const currentRole = experience.find((role) => role.isCurrent);
  const previousRoles = experience.filter((role) => !role.isCurrent);
  const publishedWriting = writing.filter((item) => item.links?.length);
  const upcomingWriting = writing.filter((item) => !item.links?.length);
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
  const projectDetails = (project: (typeof projects)[number]) => [
    `- ${project.name}: ${project.summary}`,
    `  - ${project.description}`,
    `  - Technologies: ${project.stack.join(", ")}`,
    ...(project.links ?? []).map(
      (link) => `  - ${link.prefix ?? link.label}: ${link.href}`,
    ),
  ];

  return [
    `# ${identity.name} (${identity.handle})`,
    "",
    `Role: ${identity.title}`,
    "",
    `${identity.name} is an ${identity.title} based in ${identity.location}. ${identity.workAuthorization}.`,
    "",
    "## Canonical URLs",
    "",
    `- Portfolio: ${siteUrl}/`,
    `- Resume: ${siteUrl}${resume.pagePath}`,
    "",
    "## About",
    "",
    identity.hero,
    ...identity.about,
    "",
    "## Core strengths",
    "",
    ...identity.specialties.map((specialty) => `- ${specialty}`),
    "",
    "## Education",
    "",
    `- ${identity.education.degree}`,
    `  - ${identity.education.detail}`,
    "",
    "## Publications",
    "",
    ...publishedWriting.flatMap((item) => [
      `- ${item.title}`,
      `  - ${item.meta}`,
      `  - ${item.summary}`,
      ...(item.links ?? []).map(
        (link) => `  - ${link.prefix ?? link.label}: ${link.href}`,
      ),
    ]),
    "",
    "## Current role",
    "",
    ...(currentRole
      ? [
          `- ${currentRole.role} at ${currentRole.company.label} (${currentRole.duration})`,
          `  - ${currentRole.company.label}: ${currentRole.company.href}`,
          ...(currentRole.unit
            ? [`  - ${currentRole.unit.label}: ${currentRole.unit.href}`]
            : []),
          ...(currentRole.partner
            ? [
                `  - Industry partner: ${currentRole.partner.label} (${currentRole.partner.href})`,
              ]
            : []),
          ...currentRole.details.map((detail) => `  - ${detail}`),
          ...(currentRole.relatedLinks ?? []).map(
            (link) => `  - ${link.prefix ?? link.label}: ${link.href}`,
          ),
        ]
      : []),
    "",
    "## Previous roles",
    "",
    ...previousRoles.flatMap((role) => [
      `- ${role.role} at ${role.company.label} (${role.duration})`,
      `  - ${role.company.label}: ${role.company.href}`,
      ...(role.unit ? [`  - ${role.unit.label}: ${role.unit.href}`] : []),
      ...(role.partner
        ? [`  - Industry partner: ${role.partner.label} (${role.partner.href})`]
        : []),
      ...(role.collaboratorNote
        ? [`  - ${role.collaboratorNote}`]
        : []),
      ...role.details.map((detail) => `  - ${detail}`),
      ...(role.relatedLinks ?? []).map(
        (link) => `  - ${link.prefix ?? link.label}: ${link.href}`,
      ),
    ]),
    "",
    "## Selected work",
    "",
    ...selectedProjects.flatMap(projectDetails),
    "",
    "## Additional projects",
    "",
    ...additionalProjects.flatMap(projectDetails),
    "",
    "## Research project",
    "",
    ...researchProjects.flatMap(projectDetails),
    "",
    "## Skills",
    "",
    ...skills.map(
      (group) =>
        `- ${group.title}: ${group.items.map((item) => item.label).join(", ")}`,
    ),
    "",
    "## Writing",
    "",
    ...upcomingWriting.map(
      (item) => `- ${item.title}: ${item.summary} (${item.meta})`,
    ),
    "",
    "## Contact",
    "",
    `- ${contact.emailCta.label}: ${contact.emailCta.mailto}`,
    ...contact.links.map((link) => `- ${link.label}: ${link.href}`),
    `- Location: ${contact.location}`,
  ].join("\n");
})();

export function GET() {
  return new Response(lines, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
