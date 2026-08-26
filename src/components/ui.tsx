"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Star } from "lucide-react";
import { cn, formatBDT } from "@/lib/utils";

/* ——— Scroll reveal wrapper ——— */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/* ——— Section heading ——— */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  link,
  linkLabel = "View all",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  link?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "center" ? "flex-col items-center text-center" : "flex-wrap items-end justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-champagne">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl leading-[1.12] font-medium text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link}
          className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
        >
          {linkLabel}
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/* ——— Buttons ——— */
export const btnBase =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.16em] text-[12px] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux";

export const btnPrimary = cn(
  btnBase,
  "bg-ink px-8 py-4 text-ivory hover:bg-bordeaux active:scale-[0.98]"
);
export const btnSecondary = cn(
  btnBase,
  "border border-ink bg-transparent px-8 py-4 text-ink hover:bg-ink hover:text-ivory active:scale-[0.98]"
);
export const btnGhost = cn(
  btnBase,
  "px-4 py-2.5 text-ink underline-offset-4 hover:underline"
);

/* ——— Inputs ——— */
export const inputCls =
  "w-full border border-sand bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-stone transition-colors focus:border-ink focus:outline-none";

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-taupe">{hint}</p>
      ) : null}
    </div>
  );
}

/* ——— Star rating ——— */
export function Rating({
  value,
  count,
  size = "sm",
  showCount = true,
}: {
  value: number;
  count?: number;
  size?: "xs" | "sm" | "md";
  showCount?: boolean;
}) {
  const px = size === "xs" ? "h-3 w-3" : size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  const stars = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="relative">
        <div className="flex gap-0.5">
          {stars.map((i) => (
            <Star key={i} className={cn(px, "text-sand")} fill="currentColor" strokeWidth={0} aria-hidden />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
          <div className="flex gap-0.5">
            {stars.map((i) => (
              <Star key={i} className={cn(px, "text-champagne")} fill="currentColor" strokeWidth={0} aria-hidden />
            ))}
          </div>
        </div>
      </div>
      {showCount && typeof count === "number" && (
        <span className="text-[11.5px] font-medium text-stone">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}

/* ——— Price ——— */
export function Price({
  price,
  originalPrice,
  size = "md",
  className,
}: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5",
        size === "lg" ? "text-[26px]" : size === "sm" ? "text-sm" : "text-[16.5px]",
        className
      )}
    >
      <span className="font-semibold tracking-tight text-ink">{formatBDT(price)}</span>
      {hasDiscount && (
        <span className="font-normal text-stone line-through" style={{ fontSize: "0.78em" }}>
          {formatBDT(originalPrice)}
        </span>
      )}
    </div>
  );
}

/* ——— Quantity stepper ——— */
export function QtySelector({
  qty,
  onChange,
  small = false,
}: {
  qty: number;
  onChange: (qty: number) => void;
  small?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-stretch border border-sand bg-white", small ? "h-9" : "h-12")}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className={cn("flex items-center justify-center text-espresso transition-colors hover:bg-cream disabled:opacity-40", small ? "w-8" : "w-11")}
        disabled={qty <= 1}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        aria-live="polite"
        className={cn("flex items-center justify-center border-x border-sand font-semibold text-ink", small ? "w-9 text-[13px]" : "w-12 text-[15px]")}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className={cn("flex items-center justify-center text-espresso transition-colors hover:bg-cream disabled:opacity-40", small ? "w-8" : "w-11")}
        disabled={qty >= 10}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}

/* ——— Breadcrumbs ——— */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium tracking-wide">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-stone" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="text-taupe transition-colors hover:text-bordeaux">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ——— Accordion ——— */
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  return (
    <div className="border-b border-sand">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-[17px] font-medium text-ink">{title}</span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center border border-sand text-espresso transition-transform duration-300",
            open && "rotate-45 border-ink bg-ink text-ivory"
          )}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </span>
      </button>
      <div
        ref={panelRef}
        className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-6 text-[15px] leading-relaxed text-espresso/90">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ——— Empty state ——— */
export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">{icon}</div>
      <h3 className="font-display text-2xl font-medium text-ink">{title}</h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-taupe">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={cn(btnPrimary, "mt-8")}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

/* ——— Page loader ——— */
export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-sand border-t-bordeaux" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-taupe">Loading</span>
      </div>
    </div>
  );
}
