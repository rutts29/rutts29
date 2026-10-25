import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

import { ResumePdfViewer } from "@/components/ResumePdfViewer";
import { portfolioContent } from "@/config/portfolioContent";

import "../simple-portfolio.css";

const { identity, resume, siteUrl } = portfolioContent;
const title = `${identity.name} | ${resume.label}`;
const description = `${identity.name}'s ${identity.title} resume.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: resume.pagePath,
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${resume.pagePath}`,
  },
  twitter: {
    title,
    description,
  },
};

export default function ResumePage() {
  if (!resume.isPublished) notFound();

  return (
    <div className="simple-portfolio">
      <main className="simple-shell simple-resume-shell">
        <header className="simple-resume-toolbar">
          <Link className="simple-btn-ghost" href="/">
            <ArrowLeft aria-hidden="true" />
            Portfolio
          </Link>

          <div className="simple-resume-actions">
            <a
              className="simple-btn-primary"
              href={`${resume.documentPath}?download=1`}
              download={resume.downloadName}
            >
              <Download aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </header>

        <section className="simple-resume-intro" aria-labelledby="resume-title">
          <p className="simple-label">{resume.label}</p>
          <h1 className="simple-title-lg" id="resume-title">
            {identity.name}
          </h1>
          <p className="simple-body-copy">
            {identity.title} · One-page resume
          </p>
        </section>

        {resume.assetUrl ? (
          <div className="simple-resume-document">
            <ResumePdfViewer
              source={resume.assetUrl}
              openUrl={resume.documentPath}
            />
          </div>
        ) : (
          <div className="simple-resume-unavailable" role="status">
            <p className="simple-label">Resume asset pending</p>
            <p className="simple-body-copy">
              The viewer will be available after the current PDF is uploaded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
