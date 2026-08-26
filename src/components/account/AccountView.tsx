"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Home,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Plus,
  ReceiptText,
  RefreshCcw,
  Settings,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import type { Address, Order, OrderStatus } from "@/lib/types";
import { cn, formatBDT, formatDate, isValidBDPhone } from "@/lib/utils";
import { btnPrimary, btnSecondary, Field, inputCls } from "@/components/ui";

const TABS = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "orders", label: "Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-champagne/15 text-champagne border-champagne/40",
  Confirmed: "bg-[#31587a]/10 text-[#31587a] border-[#31587a]/30",
  Shipped: "bg-[#5a4a8a]/10 text-[#5a4a8a] border-[#5a4a8a]/30",
  Delivered: "bg-success/10 text-success border-success/40",
  Cancelled: "bg-danger/10 text-danger border-danger/40",
};

export function AccountView({ initialTab }: { initialTab?: string }) {
  const { user, hydrated } = useStore();
  const [tab, setTab] = useState<TabKey>(
    TABS.some((t) => t.key === initialTab) ? (initialTab as TabKey) : "overview"
  );

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <div className="h-96 animate-pulse bg-cream" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-8">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">
          <User className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">Your account awaits</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-taupe">
          Sign in to track orders, manage addresses and keep your wishlist close.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className={btnPrimary}>Sign In</Link>
          <Link href="/signup" className={btnSecondary}>Create Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-10 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">My Account</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
      </div>

      <div className="grid gap-10 pt-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-36 lg:flex-col" aria-label="Account sections">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-current={tab === key ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 border px-5 py-3.5 text-[13px] font-semibold tracking-wide transition-all",
                  tab === key
                    ? "border-bordeaux bg-bordeaux text-ivory"
                    : "border-sand bg-white text-espresso hover:border-ink"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            ))}
            <LogoutButton />
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === "overview" && <OverviewTab goTo={setTab} />}
          {tab === "orders" && <OrdersTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  const { logout, toast } = useStore();
  return (
    <button
      type="button"
      onClick={() => {
        logout();
        toast("You've been signed out", "info");
      }}
      className="flex shrink-0 items-center gap-3 border border-sand bg-white px-5 py-3.5 text-[13px] font-semibold tracking-wide text-danger transition-all hover:border-danger"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      Sign Out
    </button>
  );
}

/* ——— Overview ——— */
function OverviewTab({ goTo }: { goTo: (t: TabKey) => void }) {
  const { user, orders, wishlistCount } = useStore();
  const latest = orders[0];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Package, label: "Total orders", value: orders.length, action: () => goTo("orders") },
          { icon: Heart, label: "Wishlist items", value: wishlistCount, href: "/wishlist" },
          { icon: MapPin, label: "Saved addresses", value: user?.addresses.length ?? 0, action: () => goTo("addresses") },
        ].map(({ icon: Icon, label, value, action, href }) => {
          const inner = (
            <>
              <Icon className="h-5 w-5 text-champagne" aria-hidden />
              <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
              <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-taupe">{label}</p>
            </>
          );
          return href ? (
            <Link key={label} href={href} className="border border-sand bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-card">
              {inner}
            </Link>
          ) : (
            <button key={label} type="button" onClick={action} className="border border-sand bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-card">
              {inner}
            </button>
          );
        })}
      </div>

      {latest ? (
        <div className="border border-sand bg-fog p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-medium text-ink">Latest order</h2>
            <StatusBadge status={latest.status} />
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex -space-x-3">
              {latest.items.slice(0, 3).map((it) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={it.productId} src={it.image} alt="" className="h-14 w-11 border-2 border-fog object-cover" />
              ))}
            </div>
            <div>
              <p className="font-semibold text-ink">{latest.id}</p>
              <p className="text-[13px] text-taupe">
                {formatDate(latest.date)} · {latest.items.length} item(s) · {formatBDT(latest.total)}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => goTo("orders")} className={cn(btnSecondary, "mt-6 px-5 py-3")}>
            View all orders
          </button>
        </div>
      ) : (
        <div className="border border-sand bg-fog p-10 text-center">
          <ShoppingBag className="mx-auto h-9 w-9 text-champagne" aria-hidden />
          <h2 className="mt-4 font-display text-xl font-medium text-ink">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-xs text-[14px] text-taupe">When you place your first order it will appear here with live status tracking.</p>
          <Link href="/shop" className={cn(btnPrimary, "mt-6")}>Start Shopping</Link>
        </div>
      )}

      <div className="border border-sand bg-white p-7">
        <h2 className="font-display text-xl font-medium text-ink">Need a hand?</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-taupe">
          Questions about a product or order? Call us at <span className="font-semibold text-ink">01815-115297</span> or
          visit the shop on Jubilee Road — we're happy to help.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/contact" className={cn(btnSecondary, "px-5 py-3")}>Contact us</Link>
          <Link href="/faq" className={cn(btnSecondary, "px-5 py-3")}>Read FAQs</Link>
        </div>
      </div>
    </div>
  );
}

/* ——— Orders ——— */
function OrdersTab() {
  const { orders, addToCart, cancelOrder, toast } = useStore();
  const [open, setOpen] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="border border-sand bg-fog p-12 text-center">
        <ReceiptText className="mx-auto h-9 w-9 text-champagne" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-medium text-ink">No orders yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-taupe">
          Your order history — with statuses from Processing to Delivered — will live here.
        </p>
        <Link href="/shop" className={cn(btnPrimary, "mt-7")}>Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          open={open === order.id}
          onToggle={() => setOpen((o) => (o === order.id ? null : order.id))}
          onReorder={() => {
            order.items.forEach((it) => addToCart(it.productId, it.qty));
            toast("Order items added back to your bag");
          }}
          onCancel={() => {
            cancelOrder(order.id);
            toast("Order cancelled", "info");
          }}
        />
      ))}
    </div>
  );
}

function OrderCard({
  order,
  open,
  onToggle,
  onReorder,
  onCancel,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
  onReorder: () => void;
  onCancel: () => void;
}) {
  return (
    <article className="border border-sand bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 px-5 py-5 text-left sm:px-7"
      >
        <span className="flex -space-x-3">
          {order.items.slice(0, 3).map((it) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={it.productId} src={it.image} alt="" className="h-14 w-11 border-2 border-white object-cover shadow-card" />
          ))}
        </span>
        <span className="min-w-28">
          <span className="block font-semibold text-ink">{order.id}</span>
          <span className="text-[12.5px] text-taupe">{formatDate(order.date)}</span>
        </span>
        <span className="hidden text-[13px] text-taupe sm:block">{order.items.reduce((s, i) => s + i.qty, 0)} item(s)</span>
        <span className="font-semibold text-ink">{formatBDT(order.total)}</span>
        <StatusBadge status={order.status} />
        <ChevronDown className={cn("ml-auto h-4 w-4 text-taupe transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div className="border-t border-sand px-5 py-6 sm:px-7">
          <ul className="space-y-4">
            {order.items.map((it) => (
              <li key={it.productId} className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt="" className="h-16 w-13 object-cover" style={{ width: 52 }} />
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${it.slug}`} className="font-medium text-ink transition-colors hover:text-bordeaux">
                    {it.name}
                  </Link>
                  <p className="text-[12.5px] text-stone">{it.brand} · Qty {it.qty}</p>
                </div>
                <p className="text-[14px] font-semibold">{formatBDT(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 border-t border-sand pt-5 text-[13.5px] sm:grid-cols-2">
            <p className="text-espresso">
              <span className="font-semibold text-ink">Deliver to:</span> {order.shipping.address}, {order.shipping.area}, {order.shipping.city}
            </p>
            <p className="text-espresso">
              <span className="font-semibold text-ink">Payment:</span>{" "}
              {{ cod: "Cash on Delivery", bkash: "bKash", nagad: "Nagad", card: "Card" }[order.paymentMethod]} ·{" "}
              <span className="font-semibold text-ink">Delivery:</span>{" "}
              {order.deliveryCharge === 0 ? "Free" : formatBDT(order.deliveryCharge)}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onReorder} className="inline-flex h-10 items-center gap-2 bg-ink px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bordeaux">
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden /> Reorder
            </button>
            {order.status === "Processing" && (
              <button type="button" onClick={onCancel} className="inline-flex h-10 items-center gap-2 border border-danger/50 px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-danger transition-colors hover:bg-danger hover:text-ivory">
                <X className="h-3.5 w-3.5" aria-hidden /> Cancel Order
              </button>
            )}
            {(order.status === "Shipped" || order.status === "Confirmed") && (
              <span className="inline-flex items-center gap-2 text-[12.5px] font-medium text-taupe">
                <Truck className="h-4 w-4 text-champagne" aria-hidden /> On its way — the courier will call on arrival.
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em]", STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

/* ——— Addresses ——— */
function AddressesTab() {
  const { user, updateUser, toast } = useStore();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: "Home", fullName: user?.name ?? "", phone: user?.phone ?? "", address: "", area: "", city: "Chattogram" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addresses = user?.addresses ?? [];

  const save = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter the recipient name.";
    if (!isValidBDPhone(form.phone)) next.phone = "Enter a valid BD phone number.";
    if (form.address.trim().length < 6) next.address = "Enter the full street address.";
    if (form.area.trim().length < 2) next.area = "Enter the area / thana.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setTimeout(() => {
      const addr: Address = {
        id: `addr-${Date.now()}`,
        label: form.label,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        area: form.area.trim(),
        city: form.city,
        isDefault: addresses.length === 0,
      };
      updateUser({ addresses: [...addresses, addr] });
      setSaving(false);
      setAdding(false);
      toast("Address saved");
    }, 500);
  };

  const remove = (id: string) => {
    updateUser({ addresses: addresses.filter((a) => a.id !== id) });
    toast("Address removed", "info");
  };

  const makeDefault = (id: string) => {
    updateUser({ addresses: addresses.map((a) => ({ ...a, isDefault: a.id === id })) });
    toast("Default address updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium text-ink">Saved Addresses</h2>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className={cn(btnSecondary, "px-5 py-3")}>
            <Plus className="h-4 w-4" aria-hidden /> Add New
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={save} className="border border-sand bg-fog p-7">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-medium text-ink">New address</p>
            <button type="button" onClick={() => setAdding(false)} aria-label="Close form" className="flex h-8 w-8 items-center justify-center text-taupe hover:text-ink">
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Label">
              <div className="flex gap-2">
                {["Home", "Office", "Other"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, label: l }))}
                    className={cn(
                      "flex-1 border py-2.5 text-[12.5px] font-semibold transition-colors",
                      form.label === l ? "border-bordeaux bg-bordeaux text-ivory" : "border-sand bg-white text-espresso"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Recipient name" error={errors.fullName}>
              <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} inputMode="tel" />
            </Field>
            <Field label="City">
              <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Street address" error={errors.address}>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputCls} placeholder="House, road, block, landmark" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Area / Thana" error={errors.area}>
                <input value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className={inputCls} placeholder="e.g. Jubilee Road, Panchlaish" />
              </Field>
            </div>
          </div>
          <button type="submit" disabled={saving} className={cn(btnPrimary, "mt-7")}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {saving ? "Saving…" : "Save Address"}
          </button>
        </form>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="border border-sand bg-fog p-12 text-center">
          <MapPin className="mx-auto h-9 w-9 text-champagne" aria-hidden />
          <h3 className="mt-4 font-display text-xl font-medium text-ink">No saved addresses</h3>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-taupe">Add your home or office address once and check out faster every time.</p>
          <button type="button" onClick={() => setAdding(true)} className={cn(btnPrimary, "mt-6")}>
            <Plus className="h-4 w-4" aria-hidden /> Add Address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <li key={addr.id} className={cn("relative border bg-white p-6 transition-all", addr.isDefault ? "border-bordeaux" : "border-sand")}>
              {addr.isDefault && (
                <span className="absolute right-4 top-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-bordeaux">
                  <Star className="h-3 w-3" fill="currentColor" aria-hidden /> Default
                </span>
              )}
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">{addr.label}</p>
              <p className="mt-3 font-semibold text-ink">{addr.fullName}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-espresso/85">
                {addr.address}, {addr.area}, {addr.city}
              </p>
              <p className="mt-1 text-[13px] text-taupe">{addr.phone}</p>
              <div className="mt-5 flex gap-4">
                {!addr.isDefault && (
                  <button type="button" onClick={() => makeDefault(addr.id)} className="text-[12px] font-semibold uppercase tracking-[0.12em] text-bordeaux hover:underline underline-offset-4">
                    Set default
                  </button>
                )}
                <button type="button" onClick={() => remove(addr.id)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-stone hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ——— Settings ——— */
function SettingsTab() {
  const { user, updateUser, toast } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = "Please enter your full name.";
    if (!isValidBDPhone(phone)) next.phone = "Enter a valid BD phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setTimeout(() => {
      updateUser({ name: name.trim(), phone: phone.trim() });
      setSaving(false);
      toast("Profile updated");
    }, 500);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="border border-sand bg-white p-7">
        <h2 className="font-display text-2xl font-medium text-ink">Profile</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input value={name} onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: "" })); }} className={inputCls} />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((er) => ({ ...er, phone: "" })); }} className={inputCls} inputMode="tel" />
          </Field>
          <Field label="Email" hint="Email changes require verification in the production version.">
            <input value={user?.email ?? ""} disabled className={cn(inputCls, "bg-cream text-stone")} />
          </Field>
        </div>
        <button type="submit" disabled={saving} className={cn(btnPrimary, "mt-7")}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <div className="border border-sand bg-white p-7">
        <h2 className="font-display text-2xl font-medium text-ink">Security</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-taupe">
          Password management in this demo is handled on-device. In production this connects to a secure auth service
          with email-verified password changes.
        </p>
        <Link href="/forgot-password" className={cn(btnSecondary, "mt-5")}>Reset password</Link>
      </div>

      <div className="flex items-center justify-between border border-sand bg-cream p-7">
        <div>
          <h2 className="font-display text-xl font-medium text-ink">Member since</h2>
          <p className="mt-1 text-[14px] text-taupe">{user ? formatDate(user.createdAt) : ""}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
