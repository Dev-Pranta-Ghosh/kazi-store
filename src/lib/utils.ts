export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Format a number as Bangladeshi Taka, e.g. ৳1,250 */
export function formatBDT(amount: number): string {
  const n = Math.round(amount);
  return `৳${n.toLocaleString("en-IN")}`;
}

export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function estimateDelivery(fromDays: number, toDays: number): string {
  const a = new Date(Date.now() + fromDays * 86400000);
  const b = new Date(Date.now() + toDays * 86400000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(a)} – ${fmt(b)}`;
}

/** Validates a Bangladeshi mobile number: 01XXXXXXXXX */
export function isValidBDPhone(phone: string): boolean {
  return /^01[3-9]\d{8}$/.test(phone.replace(/[\s-]/g, ""));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function generateOrderId(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `KS-${rand}`;
}

export const STORE = {
  name: "Kazi Store",
  nameBn: "কাজী স্টোর",
  tagline: "Premium Beauty & Cosmetics",
  address: "Sofina Bitan, Jubilee Road, Chattogram, Bangladesh",
  locatedIn: "Hotel Safina Ltd.",
  phone: "01815-115297",
  phoneHref: "tel:+8801815115297",
  email: "hello@kazistore.com.bd", // placeholder — replace with real email
  hours: "Sat – Thu, 10:00 AM – 9:00 PM", // placeholder — confirm with store
  freeShippingThreshold: 2500,
  deliveryCharges: {
    chattogram: { label: "Chattogram City (Inside)", charge: 60, eta: "1–2 days" },
    dhaka: { label: "Dhaka City", charge: 120, eta: "2–3 days" },
    nationwide: { label: "Nationwide (Outside City)", charge: 150, eta: "3–5 days" },
  },
} as const;

export const COUPONS: import("./types").Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, minSpend: 1000, label: "10% off orders over ৳1,000" },
  { code: "KAZI15", type: "percent", value: 15, minSpend: 3000, label: "15% off orders over ৳3,000" },
  { code: "BEAUTY5", type: "percent", value: 5, minSpend: 500, label: "5% off orders over ৳500" },
];
