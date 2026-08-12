import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";

export const metadata: Metadata = {
  title: "Immersive | Ruttansh",
  description:
    "Explore Ruttansh's AI engineering and machine learning work in an immersive interactive portfolio.",
  alternates: {
    canonical: "/interactive",
  },
  openGraph: {
    title: "Immersive | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work in an immersive interactive portfolio.",
    url: "/interactive",
  },
  twitter: {
    title: "Immersive | Ruttansh",
    description:
      "Explore Ruttansh's AI engineering and machine learning work in an immersive interactive portfolio.",
  },
};

export default function InteractivePage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
