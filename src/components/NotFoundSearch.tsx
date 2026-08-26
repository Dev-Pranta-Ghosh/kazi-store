"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputCls } from "@/components/ui";

export function NotFoundSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={submit} role="search" className="relative mx-auto mt-9 max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-taupe" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Search for a product instead…"
        aria-label="Search products"
        className={cn(inputCls, "pl-12 pr-28")}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bordeaux"
      >
        Search
      </button>
    </form>
  );
}
