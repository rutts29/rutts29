import { markdownResponse } from "@/lib/portfolioMarkdown";

export const dynamic = "force-static";

export function GET() {
  return markdownResponse("text/plain");
}
