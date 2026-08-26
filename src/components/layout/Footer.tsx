"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5H16.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.2H7.5v3h2.7v7h3.3Z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z" />
    </svg>
  );
}
import { CATEGORIES } from "@/data/products";
import { isValidEmail, STORE } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto">
      <NewsletterBand />

      <div className="bg-ink text-ivory/85">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
          {/* Brand */}
          <div>
            <p className="font-display text-[26px] font-semibold tracking-tight text-ivory">
              Kazi<span className="text-champagne-light"> Store</span>
            </p>
            <p className="mt-1 font-bangla text-[15px] text-ivory/60">কাজী স্টোর</p>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-ivory/65">
              Chattogram's destination for skincare, makeup, fragrance and beauty essentials — in-store on Jubilee
              Road and delivered to every corner of Bangladesh.
            </p>
            <div className="mt-7 space-y-3.5 text-[13.5px]">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden />
                <span>
                  {STORE.address}
                  <br />
                  <span className="text-ivory/55">Located in {STORE.locatedIn}</span>
                </span>
              </p>
              <a href={STORE.phoneHref} className="flex items-center gap-3 transition-colors hover:text-champagne-light">
                <Phone className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                {STORE.phone}
              </a>
              <p className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                {STORE.hours}
              </p>
              <a
                href={`mailto:${STORE.email}`}
                className="flex items-center gap-3 transition-colors hover:text-champagne-light"
              >
                <Mail className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                {STORE.email}
              </a>
            </div>
            <div className="mt-7 flex gap-3">
              {[
                { icon: FacebookIcon, label: "Facebook (link placeholder)" },
                { icon: InstagramIcon, label: "Instagram (link placeholder)" },
                { icon: YoutubeIcon, label: "YouTube (link placeholder)" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/75 transition-all hover:border-champagne hover:text-champagne-light"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop categories">
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-champagne-light">Shop</p>
            <ul className="mt-6 space-y-3 text-[14px]">
              <li>
                <Link href="/shop" className="transition-colors hover:text-champagne-light">
                  Shop All
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="transition-colors hover:text-champagne-light">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Customer care */}
          <nav aria-label="Customer care">
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-champagne-light">Customer Care</p>
            <ul className="mt-6 space-y-3 text-[14px]">
              <li><Link href="/account" className="transition-colors hover:text-champagne-light">Track Your Order</Link></li>
              <li><Link href="/faq" className="transition-colors hover:text-champagne-light">FAQs</Link></li>
              <li><Link href="/policies/delivery" className="transition-colors hover:text-champagne-light">Delivery Policy</Link></li>
              <li><Link href="/policies/returns" className="transition-colors hover:text-champagne-light">Returns & Refunds</Link></li>
              <li><Link href="/wishlist" className="transition-colors hover:text-champagne-light">Your Wishlist</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-champagne-light">Contact Us</Link></li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-champagne-light">Company</p>
            <ul className="mt-6 space-y-3 text-[14px]">
              <li><Link href="/about" className="transition-colors hover:text-champagne-light">About Kazi Store</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-champagne-light">Visit the Store</Link></li>
              <li><Link href="/policies/privacy" className="transition-colors hover:text-champagne-light">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="transition-colors hover:text-champagne-light">Terms & Conditions</Link></li>
              <li><Link href="/account" className="transition-colors hover:text-champagne-light">My Account</Link></li>
            </ul>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.26em] text-champagne-light">We Accept</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Cash on Delivery", "bKash", "Nagad", "Visa", "Mastercard"].map((m) => (
                <span
                  key={m}
                  className="border border-ivory/20 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ivory/75"
                >
                  {m}
                </span>
              ))}
            </div>
          </nav>
        </div>

        <div className="border-t border-ivory/10">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-6 text-[12.5px] text-ivory/50 sm:flex-row sm:px-8">
            <p>© {new Date().getFullYear()} Kazi Store — কাজী স্টোর. All rights reserved.</p>
            <p className="tracking-wide">Crafted with care in Chattogram, Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setState("loading");
    setMessage("");
    // Demo subscribe — connect to a real ESP (Mailchimp etc.) later.
    setTimeout(() => {
      setState("success");
      setMessage("Welcome to the Beauty List — watch your inbox for something lovely.");
      setEmail("");
    }, 900);
  };

  return (
    <div className="border-t border-sand bg-bordeaux text-ivory">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne-light">The Beauty List</p>
          <h2 className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl">
            First access to new arrivals & quiet offers.
          </h2>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ivory/70">
            One beautiful email a week. No noise, just the good stuff — exclusive drops, routines and members-only
            treats.
          </p>
        </div>
        <div>
          {state === "success" ? (
            <div className="border border-champagne/40 bg-ivory/5 px-6 py-6" role="status">
              <p className="font-display text-xl">{message}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="Your email address"
                className="w-full flex-1 border border-ivory/25 bg-transparent px-5 py-4 text-[15px] text-ivory outline-none transition-colors placeholder:text-ivory/45 focus:border-champagne-light"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-ivory px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-bordeaux transition-all hover:bg-champagne-light disabled:opacity-60"
              >
                {state === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-bordeaux/30 border-t-bordeaux" aria-hidden />
                ) : (
                  <Send className="h-3.5 w-3.5" aria-hidden />
                )}
                {state === "loading" ? "Joining" : "Subscribe"}
              </button>
            </form>
          )}
          {state === "error" && (
            <p role="alert" className="mt-2.5 text-[13px] font-medium text-champagne-light">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
