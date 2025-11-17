import { ScrollTimelineEntry } from "@/types/scroll";

export const scrollTimeline: ScrollTimelineEntry[] = [
  {
    id: "about",
    label: "About",
    command: "about",
    summary: "Get the quick story and focus areas.",
  },
  {
    id: "skills",
    label: "Skills",
    command: "skills",
    summary: "See the grouped stack and tooling.",
  },
  {
    id: "experience",
    label: "Experience",
    command: "experience",
    summary: "Chronological roles and highlights.",
  },
  {
    id: "projects",
    label: "Projects",
    command: "projects",
    summary: "Selected builds with stack and links.",
  },
  {
    id: "contact",
    label: "Contact",
    command: "contact",
    summary: "Reach out via email or socials.",
  },
];

