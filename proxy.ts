import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { aboutMarkdown, homepageMarkdown, llmsText, notFoundMarkdown } from "./lib/agent-content";

// Captured from public/ by next.config.ts so new static assets keep their normal behavior.
const publicFiles = new Set<string>(JSON.parse(process.env.JEEZLABS_PUBLIC_FILES ?? "[]"));
const fixedResources = new Set(["/favicon.ico", "/robots.txt", "/sitemap.xml"]);
const htmlType = "text/html; charset=utf-8";
const markdownType = "text/markdown; charset=utf-8";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Next.js owns RSC, prefetch, server actions, and framework resources.
  if (!["GET", "HEAD"].includes(request.method) || request.headers.has("rsc") ||
      path.startsWith("/_next/") || path.startsWith("/api/") ||
      publicFiles.has(path) || fixedResources.has(path)) {
    return NextResponse.next();
  }

  const direct = path === "/index.md" || path === "/about.md" || path === "/llms.txt";
  const type = direct ? markdownType : new Negotiator({
    headers: { accept: request.headers.get("accept") ?? undefined },
  }).mediaType([htmlType, markdownType]);
  const headers = new Headers({
    Vary: "Accept",
    // Avoid mixing representations in CDN caches that don't key on arbitrary Vary fields.
    "Cache-Control": "private, no-store",
    Link: '</llms.txt>; rel="describedby"',
  });

  if (!type) {
    headers.set("Content-Type", "text/plain; charset=utf-8");
    return new NextResponse(request.method === "HEAD" ? null : "Not acceptable. Request text/html or text/markdown.\n", { status: 406, headers });
  }
  if (type === htmlType) {
    return NextResponse.next({ headers });
  }

  headers.set("Content-Type", markdownType);
  let body: string;
  let status = 200;
  switch (path) {
    case "/":
    case "/index.md": body = homepageMarkdown(); break;
    case "/about":
    case "/about.md": body = aboutMarkdown; break;
    case "/llms.txt": body = llmsText; break;
    default: body = notFoundMarkdown; status = 404;
  }
  return new NextResponse(request.method === "HEAD" ? null : body, { status, headers });
}

export const config = { matcher: "/:path*" };
