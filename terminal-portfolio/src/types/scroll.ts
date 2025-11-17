export type ScrollTimelineEntry = {
  id: string;
  label: string;
  command: string;
  summary: string;
  content: string[];
  icons?: { label: string; iconSrc: string }[];
  iconGroups?: {
    title: string;
    items: { label: string; iconSrc?: string; badgeSrc?: string }[];
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
};

