import type { Metadata } from "next";

import { SmoothScroll } from "@/components/SmoothScroll";
import { TerminalExperience } from "@/components/TerminalExperience";

export const metadata: Metadata = {
  title: "Terminal | Ruttansh",
  description:
    "Explore Ruttansh's work in a live terminal shell. The full portfolio lives on the home page.",
  alternates: {
    canonical: "/interactive",
  },
  openGraph: {
    title: "Terminal | Ruttansh",
    description:
      "Explore Ruttansh's work in a live terminal shell. The full portfolio lives on the home page.",
    url: "/interactive",
  },
  twitter: {
    title: "Terminal | Ruttansh",
    description:
      "Explore Ruttansh's work in a live terminal shell. The full portfolio lives on the home page.",
  },
};

export default function InteractivePage() {
  return (
    <SmoothScroll>
      <TerminalExperience />
    </SmoothScroll>
  );
}
