import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";

export const metadata: Metadata = {
  title: "Interactive view | Ruttansh",
  description:
    "Explore Ruttansh's AI engineering and machine learning work through an interactive portfolio experience.",
  alternates: {
    canonical: "/interactive",
  },
  openGraph: {
    title: "Interactive view | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work through an interactive portfolio experience.",
    url: "/interactive",
  },
  twitter: {
    title: "Interactive view | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work through an interactive portfolio experience.",
  },
};

export default function InteractivePage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
