import {
  formatOrganizationNames,
  portfolioContent,
} from "@/config/portfolioContent";

export const dynamic = "force-static";

const lines = (() => {
  const { siteUrl, identity, projects, skills, experience, writing, contact } =
    portfolioContent;
  const currentRole = experience.find((role) => role.isCurrent);
  const previousRoles = experience.filter((role) => !role.isCurrent);
  const publishedWriting = writing.filter((item) => item.links?.length);
  const upcomingWriting = writing.filter((item) => !item.links?.length);

  return [
    `# ${identity.name} (${identity.handle})`,
    "",
    `Role: ${identity.title}`,
    "",
    `${identity.name} is an ${identity.title.replace(" · ", " and ")} based in ${identity.location}.`,
    "",
    "## Canonical URLs",
    "",
    `- Portfolio: ${siteUrl}/`,
    `- Terminal: ${siteUrl}/interactive`,
    `- Legacy redirect: ${siteUrl}/terminal`,
    "",
    "## About",
    "",
    identity.hero,
    identity.summary,
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
          `- ${currentRole.role} at ${formatOrganizationNames(currentRole.organizations)} (${currentRole.duration})`,
          ...currentRole.organizations.map(
            (organization) =>
              `  - ${organization.label}: ${organization.href}`,
          ),
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
      `- ${role.role} at ${formatOrganizationNames(role.organizations)} (${role.duration})`,
      ...role.organizations.map(
        (organization) => `  - ${organization.label}: ${organization.href}`,
      ),
    ]),
    "",
    "## Selected work",
    "",
    ...projects.flatMap((project) => [
      `- ${project.name}: ${project.summary}`,
      `  - ${project.description}`,
      `  - Technologies: ${project.stack.join(", ")}`,
    ]),
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
    `- ${contact.demoCta.label}: ${contact.demoCta.mailto}`,
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
