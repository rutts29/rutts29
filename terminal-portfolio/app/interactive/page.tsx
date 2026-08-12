import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";
import { portfolioContent } from "@/config/portfolioContent";

const { identity } = portfolioContent;
const terminalTitle = `${identity.name} | ${identity.title} | Terminal`;
const terminalDescription = `Explore ${identity.name}'s AI systems, applied ML research, and experience in an interactive portfolio shell.`;

export const metadata: Metadata = {
  title: terminalTitle,
  description: terminalDescription,
  alternates: {
    canonical: "/interactive",
  },
  openGraph: {
    title: terminalTitle,
    description: terminalDescription,
    url: "/interactive",
  },
  twitter: {
    title: terminalTitle,
    description: terminalDescription,
  },
};

export default function InteractivePage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
