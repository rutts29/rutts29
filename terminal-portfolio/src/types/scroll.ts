export type ScrollTimelineEntry = {
  id: string;
  label: string;
  command: string;
  summary: string;
  content: string[];
  iconGroups?: {
    title: string;
    items: { label: string; iconSrc?: string; badgeSrc?: string }[];
  }[];
  projects?: {
    name: string;
    description: string;
    stack: string[];
    repoUrl: string;
    liveUrl?: string;
    image?: string;
  }[];
  timeline?: {
    company: string;
    companyUrl?: string;
    partnerUrl?: string;
    role: string;
    duration: string;
    location: string;
    details: string[];
    isCurrent?: boolean;
  }[];
  contactLinks?: {
    label: string;
    href?: string;
    icon: "email" | "linkedin" | "github" | "x" | "location";
  }[];
};

