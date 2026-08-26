import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, HeartHandshake, LucideIcon, MapPin, Phone, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import { Reveal, SectionHeading, btnPrimary, btnSecondary } from "@/components/ui";
import { STORE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kazi Store — কাজী স্টোর: a dedicated cosmetics and beauty destination on Jubilee Road, Chattogram, serving customers in-store and across Bangladesh.",
  alternates: { canonical: "/about" },
};

const VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Sparkles,
    title: "Curated, not cluttered",
    text: "Every shelf is chosen with intention — we stock what we believe in, from K-beauty icons to everyday essentials that simply work.",
  },
  {
    icon: HeartHandshake,
    title: "Honest guidance",
    text: "No pressure, no jargon. Tell us your skin, your budget, your goal — we'll point you to the right product, even if it's the affordable one.",
  },
  {
    icon: Truck,
    title: "Beyond the counter",
    text: "Our Jubilee Road shop is home, but our service travels — careful packing and delivery to every district in Bangladesh.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-24">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bordeaux">Our Story — আমাদের গল্প</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] font-medium text-ink sm:text-5xl lg:text-6xl">
              Chattogram's corner of considered beauty.
            </h1>
            <p className="mt-6 max-w-2xl text-[16.5px] leading-relaxed text-espresso/90">
              Kazi Store — কাজী স্টোর — began with a simple frustration: finding genuinely good cosmetics in
              Chattogram meant travelling too far or trusting too little. So we built the shop we wished existed,
              right on Jubilee Road.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story + image */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 border border-champagne/50" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/store-interior.jpg"
              alt="Inside the Kazi Store boutique — organized shelves of skincare and fragrance"
              loading="lazy"
              className="relative aspect-[4/3] w-full object-cover shadow-soft"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">A Neighborhood Institution</p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Behind the counter at Sofina Bitan.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-6 space-y-5 text-[15.5px] leading-[1.85] text-espresso/90">
              <p>
                From our home in Sofina Bitan, Jubilee Road — inside Hotel Safina Ltd. — we've grown into a trusted
                stop for skincare, makeup, fragrance and grooming. Locals know us for unhurried advice and shelves
                that keep pace with what the beauty world is actually excited about.
              </p>
              <p>
                This website is the next chapter of that story: the same care, the same shelves, now open to all of
                Bangladesh — with delivery to your door and the same phone number that's always answered our
                counters.
              </p>
              <p className="border-l-2 border-champagne pl-5 italic text-espresso/80">
                Replace this section with the founder's own story when ready — it's crafted to be swapped out without
                touching the design.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission band */}
      <section className="border-y border-sand bg-ink text-ivory">
        <div className="mx-auto max-w-[1440px] px-4 py-20 text-center sm:px-8 lg:py-24">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne-light">Our Mission</p>
            <p className="mx-auto mt-6 max-w-3xl font-display text-3xl leading-[1.3] font-medium sm:text-4xl">
              “To make premium beauty feel approachable — honest prices, honest advice, and a shopping experience that
              treats every customer like a regular.”
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Why Shop With Us" title="What we stand behind" />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120}>
              <article className="h-full border border-sand bg-fog p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card lg:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-[22px] font-medium text-ink">{title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-espresso/85">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-xl text-center text-[13px] leading-relaxed text-stone">
            Space reserved for authenticity guarantees, brand authorizations and certifications — ready to display
            once verified by the business.
          </p>
        </Reveal>
      </section>

      {/* Visit us */}
      <section className="border-t border-sand bg-cream">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bordeaux">Visit In Person</p>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
                Come say hello on Jubilee Road.
              </h2>
              <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-espresso/90">
                There's nothing like testing a shade in real light or finding your signature scent in person. Our
                team would love to meet you.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-9 space-y-4 text-[15px]">
                <p className="flex items-start gap-3.5">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-champagne" aria-hidden />
                  <span>
                    <strong className="font-semibold">{STORE.name} — {STORE.nameBn}</strong>
                    <br />
                    {STORE.address}
                    <br />
                    <span className="text-taupe">Located in {STORE.locatedIn}</span>
                  </span>
                </p>
                <a href={STORE.phoneHref} className="flex items-center gap-3.5 transition-colors hover:text-bordeaux">
                  <Phone className="h-5 w-5 shrink-0 text-champagne" aria-hidden />
                  <span className="font-semibold">{STORE.phone}</span>
                </a>
                <p className="flex items-center gap-3.5">
                  <Clock3 className="h-5 w-5 shrink-0 text-champagne" aria-hidden />
                  {STORE.hours} <span className="text-[12px] italic text-stone">(confirm hours with the store)</span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className={btnPrimary}>Contact Us</Link>
                <Link href="/shop" className={btnSecondary}>Shop Online</Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/7691114/pexels-photo-7691114.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=500&h=620" alt="Skincare essentials arranged with a towel" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/32630380/pexels-photo-32630380.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=500&h=620" alt="Elegant perfume bottle" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="mt-10 space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/7256120/pexels-photo-7256120.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=500&h=620" alt="Makeup flat lay on peach background" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/6690232/pexels-photo-6690232.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=500&h=620" alt="Cream jars on marble with leaves" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What's next */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 text-center sm:px-8">
        <Reveal>
          <Store className="mx-auto h-9 w-9 text-champagne" aria-hidden />
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
            One shop on Jubilee Road. Nationwide in spirit.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-taupe">
            Order online for delivery anywhere in Bangladesh, or visit us in-store — either way, you get the same
            shelves and the same sincerity.
          </p>
          <Link href="/shop" className={`${btnPrimary} mt-9`}>
            Start Shopping
          </Link>
        </Reveal>
      </section>
    </>
  );
}
