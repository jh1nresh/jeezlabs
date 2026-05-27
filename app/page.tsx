import Image from "next/image";
import { PRODUCTS, STATUS_LABEL, type Builder } from "./products";

const builders: Record<Builder, string> = {
  jhinresh: "built by jhinresh",
  ezven: "built by ezven",
  both: "built by jhinresh + ezven",
};

const builderClass: Record<Builder, string> = {
  jhinresh: "je-on",
  ezven: "ez-on",
  both: "both-on",
};

export default function Home() {
  const liveCount = PRODUCTS.filter((product) => product.status === "live").length;
  const shippedCount = PRODUCTS.filter((product) => product.status === "shipped").length;
  const buildingCount = PRODUCTS.filter((product) => product.status === "building").length;
  const featured = PRODUCTS[0];

  return (
    <main>
      <header className="site-header" aria-label="Site header">
        <a className="brand" href="#top" aria-label="JeezLabs home">
          jeez<em>labs</em>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#products">products</a>
          <a href="#builders">builders</a>
          <a href="https://x.com/0xmaiat" target="_blank" rel="noreferrer">
            @0xmaiat
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="meta-line">two builders / public product log / 2026</p>
          <h1>
            small products,
            <br />
            kept <em>in public.</em>
          </h1>
          <p className="hero-lede">
            JeezLabs is the shared index for experiments we actually ship:
            agent marketplaces, iOS apps, rental tools, verified reviews,
            protocol layers, and weird useful internet software.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href="#products">
              view products
            </a>
            <a
              className="button secondary"
              href="https://x.com/virtuals_io/status/2032005346185920557?s=20"
              target="_blank"
              rel="noreferrer"
            >
              virtuals post
            </a>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Current JeezLabs snapshot">
          <div className="panel-top">
            <span>featured</span>
            <span>{featured.year}</span>
          </div>
          <div className="featured-preview">
            <Image
              src={featured.previewImage}
              alt={`${featured.name} product preview`}
              fill
              priority
              sizes="(max-width: 900px) 92vw, 520px"
            />
          </div>
          <div className="featured-body">
            <div>
              <h2>{featured.name}</h2>
              <p>{featured.kind}</p>
            </div>
            {featured.award ? <span className="award">{featured.award}</span> : null}
          </div>
          <dl className="stats-grid" aria-label="Product counts">
            <div>
              <dt>live</dt>
              <dd>{String(liveCount).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>shipped</dt>
              <dd>{String(shippedCount).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>building</dt>
              <dd>{String(buildingCount).padStart(2, "0")}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="section intro-grid" aria-label="Lab principles">
        <div>
          <p className="section-kicker">how the page works</p>
          <h2>Not a landing page. A living index.</h2>
        </div>
        <div className="principles">
          <p>
            New products go at the top. Rough products stay visible. Paused work
            gets marked instead of hidden.
          </p>
          <p>
            Each row shows who built it with the JEEZ split: JE for Jhinresh,
            EZ for Ezven, and both lit when the project is shared.
          </p>
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="section-head">
          <div>
            <p className="section-kicker">products</p>
            <h2>{PRODUCTS.length} entries, newest first.</h2>
          </div>
          <p>
            Hover or scan the cards. Web products link to live pages when they
            exist; iOS and private-stage projects route to GitHub.
          </p>
        </div>

        <div className="product-grid">
          {PRODUCTS.map((product, index) => {
            const primaryHref = product.href ?? product.repo ?? "#";

            return (
              <article className="product-card" key={product.slug}>
                <a
                  className="preview-link"
                  href={primaryHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${product.name}`}
                >
                  <Image
                    src={product.previewImage}
                    alt={`${product.name} preview`}
                    fill
                    sizes="(max-width: 760px) 92vw, (max-width: 1200px) 44vw, 360px"
                  />
                </a>

                <div className="product-content">
                  <div className="product-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`status ${product.status}`}>
                      {STATUS_LABEL[product.status]}
                    </span>
                  </div>

                  <div className="title-row">
                    <h3>{product.name}</h3>
                    {product.award ? <span className="award small">{product.award}</span> : null}
                  </div>

                  <p className="kind">{product.kind}</p>
                  <p className="description">{product.description}</p>

                  <ul className="note-list" aria-label={`${product.name} highlights`}>
                    {product.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>

                  <div className="card-foot">
                    <span
                      className={`jeez-mark ${builderClass[product.builder]}`}
                      aria-label={builders[product.builder]}
                    >
                      <span>JE</span>
                      <span>EZ</span>
                    </span>
                    <div className="links">
                      {product.href ? (
                        <a href={product.href} target="_blank" rel="noreferrer">
                          live
                        </a>
                      ) : null}
                      {product.repo ? (
                        <a href={product.repo} target="_blank" rel="noreferrer">
                          gh
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section builders" id="builders">
        <div>
          <p className="section-kicker">builders</p>
          <h2>
            two friends.
            <br />
            one lab.
          </h2>
        </div>

        <div className="builder-cards">
          <article className="builder-card">
            <Image
              src="/avatars/jhinresh.jpg"
              alt="Jhinresh profile picture"
              width={104}
              height={104}
            />
            <div>
              <h3>jhinresh</h3>
              <p>builder / product</p>
              <div className="links">
                <a href="https://github.com/JhiNResH" target="_blank" rel="noreferrer">
                  github
                </a>
                <a href="https://x.com/JhiNResH" target="_blank" rel="noreferrer">
                  x
                </a>
              </div>
            </div>
          </article>

          <article className="builder-card">
            <Image
              src="/avatars/ezven.jpg"
              alt="Ezven profile picture"
              width={104}
              height={104}
            />
            <div>
              <h3>ezven</h3>
              <p>builder / product</p>
              <div className="links">
                <a href="https://github.com/Ferxxo-pa" target="_blank" rel="noreferrer">
                  github
                </a>
                <a href="https://x.com/ezveng" target="_blank" rel="noreferrer">
                  x
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <span>jeezlabs / product index</span>
        <div className="links">
          <a
            href="https://x.com/virtuals_io/status/2032005346185920557?s=20"
            target="_blank"
            rel="noreferrer"
          >
            virtuals post
          </a>
          <a
            href="https://x.com/0xmaiat"
            target="_blank"
            rel="noreferrer"
          >
            @0xmaiat
          </a>
        </div>
      </footer>
    </main>
  );
}
