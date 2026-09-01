import { readFile } from "node:fs/promises";

import { portfolioContent } from "@/config/portfolioContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const { resume } = portfolioContent;

function responseHeaders(download: boolean) {
  const disposition = download ? "attachment" : "inline";
  const encodedName = encodeURIComponent(resume.downloadName);

  return new Headers({
    "Cache-Control": "private, no-store, max-age=0",
    "Content-Disposition": `${disposition}; filename="${resume.downloadName}"; filename*=UTF-8''${encodedName}`,
    "Content-Type": "application/pdf",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function copyUpstreamHeader(
  upstream: Headers,
  response: Headers,
  name: string,
) {
  const value = upstream.get(name);
  if (value) response.set(name, value);
}

async function serveRemoteResume(
  source: string,
  request: Request,
  headers: Headers,
  headOnly: boolean,
) {
  const sourceUrl = new URL(source);
  if (sourceUrl.protocol !== "https:") {
    throw new Error("Resume source must use HTTPS");
  }

  // The Blob is updated in place. Use a fresh upstream URL for every request
  // so downloads never require a browser hard refresh after replacement.
  sourceUrl.searchParams.set("portfolio-version", String(Date.now()));

  const range = request.headers.get("range");
  const upstream = await fetch(sourceUrl, {
    method: headOnly ? "HEAD" : "GET",
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!upstream.ok && upstream.status !== 206) {
    throw new Error(`Resume source returned ${upstream.status}`);
  }

  copyUpstreamHeader(upstream.headers, headers, "accept-ranges");
  copyUpstreamHeader(upstream.headers, headers, "content-length");
  copyUpstreamHeader(upstream.headers, headers, "content-range");
  copyUpstreamHeader(upstream.headers, headers, "etag");
  copyUpstreamHeader(upstream.headers, headers, "last-modified");

  return new Response(headOnly ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function serveLocalResume(
  source: string,
  headers: Headers,
  headOnly: boolean,
) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Local resume source is disabled in production");
  }

  const body = await readFile(source);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(body.byteLength));

  return new Response(headOnly ? null : body, { headers });
}

async function serveResume(request: Request, headOnly = false) {
  const download = new URL(request.url).searchParams.get("download") === "1";
  const headers = responseHeaders(download);
  const remoteSource = process.env.RESUME_PDF_URL?.trim() || resume.assetUrl;
  const localSource = process.env.RESUME_PDF_LOCAL_PATH?.trim();

  try {
    if (remoteSource) {
      return await serveRemoteResume(
        remoteSource,
        request,
        headers,
        headOnly,
      );
    }

    if (localSource) {
      return await serveLocalResume(localSource, headers, headOnly);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Resume delivery failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
    return Response.json(
      { error: "The resume is temporarily unavailable." },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }

  return Response.json(
    { error: "The resume has not been configured yet." },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}

export function GET(request: Request) {
  return serveResume(request);
}

export function HEAD(request: Request) {
  return serveResume(request, true);
}
