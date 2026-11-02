import type { Metadata } from "next";
import { organization, SITE_TITLE, SITE_DESCRIPTION } from "../lib/site";
import ProductIndex from "./ProductIndex";

export const metadata: Metadata = { alternates: { canonical: "/", types: { "text/markdown": "/index.md" } }, openGraph: { type: "website", title: SITE_TITLE, description: SITE_DESCRIPTION, url: "/", siteName: "JeezLabs", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "JeezLabs product lab and project index" }] } };

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <ProductIndex />
  </>;
}
