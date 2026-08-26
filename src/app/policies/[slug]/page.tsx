import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POLICIES, type PolicyKey } from "@/data/content";
import { Breadcrumbs, Reveal } from "@/components/ui";
import { cn } from "@/lib/utils";

const KEY_MAP: Record<string, PolicyKey> = {
  delivery: "delivery",
  returns: "returns",
  privacy: "privacy",
  terms: "terms",
};

export function generateStaticParams() {
  return Object.keys(KEY_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const key = KEY_MAP[slug];
  if (!key) return {};
  const policy = POLICIES[key];
  return {
    title: policy.title,
    description: policy.subtitle,
    alternates: { canonical: `/policies/${slug}` },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const key = KEY_MAP[slug];
  if (!key) notFound();
  const policy = POLICIES[key];

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-10 lg:py-14">
        <Reveal>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: policy.title }]} />
          <h1 className="mt-5 font-display text-4xl font-medium text-ink sm:text-5xl">{policy.title}</h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-espresso/85">{policy.subtitle}</p>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-stone">{policy.updated}</p>
        </Reveal>
      </div>

      <div className="grid gap-12 py-12 lg:grid-cols-[240px_1fr]">
        <nav className="lg:sticky lg:top-36 lg:self-start" aria-label="Other policies">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-champagne">Policies</p>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {Object.entries(KEY_MAP).map(([s, k]) => (
              <li key={s} className="shrink-0">
                <Link
                  href={`/policies/${s}`}
                  aria-current={s === slug ? "page" : undefined}
                  className={cn(
                    "block border px-4 py-2.5 text-[13px] font-medium transition-all",
                    s === slug
                      ? "border-bordeaux bg-bordeaux text-ivory"
                      : "border-sand bg-white text-espresso hover:border-ink"
                  )}
                >
                  {POLICIES[k].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="min-w-0">
          {policy.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 60}>
              <section className={cn(i > 0 && "mt-10", "border-b border-sand pb-10")}>
                <h2 className="flex items-baseline gap-4 font-display text-[22px] font-medium text-ink">
                  <span className="text-[13px] font-semibold text-champagne">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((para, j) => {
                    const isEditNote = para.startsWith("This page contains sample policy content");
                    return (
                      <p
                        key={j}
                        className={cn(
                          "text-[15px] leading-[1.85]",
                          isEditNote
                            ? "border border-champagne/40 bg-cream px-5 py-4 text-[13px] italic text-espresso/80"
                            : "text-espresso/90"
                        )}
                      >
                        {para}
                      </p>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          ))}
          <Reveal delay={120}>
            <p className="mt-10 text-[14px] text-taupe">
              Questions about this policy? Call{" "}
              <a href="tel:+8801815115297" className="font-semibold text-bordeaux">
                01815-115297
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="font-semibold text-bordeaux underline underline-offset-4">
                contact page
              </Link>
              .
            </p>
          </Reveal>
        </article>
      </div>
    </div>
  );
}
