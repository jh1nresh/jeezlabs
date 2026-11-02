"use client";

import Link from "next/link";
import { useState } from "react";
import { PRODUCTS, type ProductStatus } from "./products";
import styles from "./index.module.css";

const FILTERS = ["all", "live", "shipped", "building", "preview"] as const;
const STATUS_COLORS: Record<ProductStatus, string> = {
  live: "var(--mint)", shipped: "var(--red)", building: "var(--blue)", preview: "var(--purple)", paused: "var(--muted)",
};
const counts = Object.fromEntries(FILTERS.map(s => [s, s === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.s === s).length]));
const pad = (n: number) => String(n).padStart(2, "0");
function OutLink({ href, label, children }: { href: string; label?: string; children: React.ReactNode }) {
  return <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">{children}</a>;
}
function Maker({ name }: { name: string }) {
  return <span className="makers" role="group" aria-label={`Built by ${name}`}>
    {name.includes("jhinresh") && <span className="maker" aria-hidden="true">JH</span>}
    {name.includes("ezven") && <span className="maker ez" aria-hidden="true">EZ</span>}
    {name === "JeezLabs" && <span className="maker studio" aria-hidden="true">JL</span>}
  </span>;
}
export default function ProductIndex() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  return <div className={styles.root}>
    <a className="skip" href="#products">Skip to products</a>
    <div className="page">
      <header><Link className="brand" href="/" aria-label="JeezLabs home"><span className="brand-mark" aria-hidden="true" />JEEZLABS</Link><span className="header-note">INDEPENDENT PRODUCT STUDIO</span><nav aria-label="Main navigation"><a href="/about">ABOUT</a><OutLink href="https://github.com/jh1nresh/jeezlabs">GH ↗</OutLink><OutLink href="https://x.com/0xmaiat">X ↗</OutLink></nav></header>
      <nav className="browse-mode" aria-label="Browse mode"><Link href="/" aria-current="page">01 / INDEX</Link><a href="/explore.html">02 / EXPLORE <span aria-hidden="true">↗</span></a></nav>
      <main id="products">
        <h1 className="sr-only">JeezLabs product lab — product drop index</h1>
        <div className="index-heading"><h2><span>PRODUCT DROP INDEX</span><span className="range"> / 001—{String(PRODUCTS.length).padStart(3, "0")}</span></h2><p>Products built at JeezLabs</p></div>
        <div className="filterbar"><div className="filters" role="group" aria-label="Filter projects by status">{FILTERS.map(s => <button type="button" key={s} aria-pressed={filter === s} onClick={() => setFilter(s)}>{s.toUpperCase()} <span>{s === "all" ? counts[s] : pad(counts[s])}</span></button>)}</div><span className="result-count" role="status" aria-live="polite">{filter === "all" ? `${PRODUCTS.length} / ${PRODUCTS.length} PROJECTS` : `${pad(counts[filter])} ${filter.toUpperCase()} PROJECTS`}</span></div>
        <div className="column-head" aria-hidden="true"><span>NO.</span><span>PROJECT</span><span>WHAT IT DOES</span><span>STATUS</span><span>BUILT BY</span><span>EXPLORE</span></div>
        <ol className="products" aria-label="JeezLabs product drops">{PRODUCTS.map((p, i) => <li className="product" data-status={p.s[0].toUpperCase() + p.s.slice(1)} key={p.slug} hidden={filter !== "all" && p.s !== filter} style={{ "--status": STATUS_COLORS[p.s] } as React.CSSProperties}>
          <span className="project-index" aria-hidden="true"><span>#</span>{pad(i + 1)}</span>
          <div className="project-name"><h2><OutLink href={(p.href ?? p.repo)!} label={`Open ${p.t}`}>{p.t}</OutLink></h2>{p.hackathon && <span className="winner">Hackathon winner</span>}</div>
          <p className="project-description">{p.k}</p>
          <div className="mobile-meta"><span className="project-status">{p.s[0].toUpperCase() + p.s.slice(1)}</span><Maker name={p.builtBy ?? "jhinresh + ezven"} /></div>
          <div className="project-links">{p.href && <OutLink href={p.href} label={`${p.t} website`}>WEB ↗</OutLink>}{p.repo && <OutLink href={p.repo} label={`${p.t} on GitHub`}>GH ↗</OutLink>}</div>
        </li>)}</ol>
        <div className="summary"><div className="totals" role="group" aria-label="Full collection statistics">{FILTERS.filter(s => s !== "all").map(s => <span className="total" key={s}>{s.toUpperCase()} <strong>{pad(counts[s])}</strong></span>)}<span className="total">WINNERS <strong>{pad(PRODUCTS.filter(p => p.hackathon).length)}</strong></span></div><div className="maker-legend" role="group" aria-label="Maker initials"><span><b className="maker">JH</b> JHINRESH</span><span><b className="maker ez">EZ</b> EZVEN</span><span><b className="maker">JH</b><b className="maker ez">EZ</b> SHARED</span><span><b className="maker studio">JL</b> JEEZLABS</span></div></div>
      </main>
      <footer><p><span className="closing">JeezLabs</span><br />Independent product studio</p><div className="footer-links"><a href="/about">ABOUT THE STUDIO ↗</a><a href="#products">BACK TO TOP ↑</a></div></footer>
    </div>
  </div>;
}
