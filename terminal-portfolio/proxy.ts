import { NextResponse, type NextRequest } from "next/server";

import { markdownPaths } from "@/lib/portfolioMarkdown";

/** Agents that ask for Markdown at / get the Markdown version of the page. */
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  const wantsMarkdown =
    accept.includes("text/markdown") && !accept.includes("text/html");

  if (!wantsMarkdown) return NextResponse.next();

  return NextResponse.rewrite(new URL(markdownPaths.index, request.url));
}

export const config = {
  matcher: "/",
};
