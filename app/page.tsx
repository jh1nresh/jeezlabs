import type { Metadata } from "next";
import { organization } from "../lib/site";
import ProductIndex from "./ProductIndex";

export const metadata: Metadata = { alternates: { canonical: "/", types: { "text/markdown": "/index.md" } } };

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <ProductIndex />
  </>;
}
