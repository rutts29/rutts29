import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";

export const metadata: Metadata = {
  title: "Terminal | Ruttansh",
  description:
    "Explore Ruttansh's work in a live terminal shell.",
  alternates: {
    canonical: "/interactive",
  },
  openGraph: {
    title: "Terminal | Ruttansh",
    description: "Explore Ruttansh's work in a live terminal shell.",
    url: "/interactive",
  },
  twitter: {
    title: "Terminal | Ruttansh",
    description: "Explore Ruttansh's work in a live terminal shell.",
  },
};

export default function InteractivePage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
