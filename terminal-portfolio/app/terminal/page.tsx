import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";

export const metadata: Metadata = {
  title: "Interactive Terminal | Ruttansh",
  description:
    "Explore Ruttansh's AI engineering and machine learning work through an interactive terminal portfolio.",
  alternates: {
    canonical: "/terminal",
  },
  openGraph: {
    title: "Interactive Terminal | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work through an interactive terminal portfolio.",
    url: "/terminal",
  },
  twitter: {
    title: "Interactive Terminal | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work through an interactive terminal portfolio.",
  },
};

export default function TerminalPage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
