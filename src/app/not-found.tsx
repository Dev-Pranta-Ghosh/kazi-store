import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { btnPrimary, btnSecondary } from "@/components/ui";
import { NotFoundSearch } from "@/components/NotFoundSearch";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 text-center sm:px-8">
      <p className="font-display text-[7rem] leading-none font-light tracking-tight text-champagne/60 sm:text-[10rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
        This shelf is empty
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-taupe">
        The page you're looking for has moved, sold out, or never made it to the floor. Let's find you something
        better.
      </p>

      <NotFoundSearch />

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className={btnPrimary}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Home
        </Link>
        <Link href="/shop" className={btnSecondary}>
          <Compass className="h-4 w-4" aria-hidden /> Browse the Shop
        </Link>
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-champagne">Popular categories</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="border border-sand bg-white px-5 py-2.5 text-[13.5px] font-medium text-espresso transition-all hover:border-bordeaux hover:text-bordeaux"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
