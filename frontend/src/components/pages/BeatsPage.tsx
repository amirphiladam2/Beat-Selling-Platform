"use client";

import {
  Check,
  ChevronDown,
  Filter,
  Grid2X2,
  Headphones,
  Play,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Square,
  AudioLines,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type Beat = {
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  price: number;
  license: string;
  color: string;
  icon: typeof AudioLines;
  featured?: boolean;
};
const beats: Beat[] = [
  {
    title: "Midnight Drive",
    genre: "R&B",
    mood: "Atmospheric",
    bpm: 92,
    price: 49,
    license: "Premium lease",
    color: "from-[#4420a0] via-[#5522bc] to-[#27145f]",
    icon: AudioLines,
    featured: true,
  },
  {
    title: "Velvet Room",
    genre: "R&B",
    mood: "Soulful",
    bpm: 84,
    price: 39,
    license: "Basic lease",
    color: "from-[#7e2500] via-[#b83705] to-[#541903]",
    icon: Headphones,
  },
  {
    title: "Low Gravity",
    genre: "Hip Hop",
    mood: "Chill",
    bpm: 76,
    price: 59,
    license: "Premium lease",
    color: "from-[#005f5a] via-[#087a70] to-[#003b3b]",
    icon: SlidersHorizontal,
  },
  {
    title: "After Hours",
    genre: "Hip Hop",
    mood: "Dark",
    bpm: 88,
    price: 45,
    license: "Basic lease",
    color: "from-[#17376f] via-[#245da0] to-[#101f4c]",
    icon: AudioLines,
  },
  {
    title: "Paper Planes",
    genre: "Pop",
    mood: "Bright",
    bpm: 108,
    price: 35,
    license: "Basic lease",
    color: "from-[#974e00] via-[#d5770c] to-[#633000]",
    icon: Headphones,
  },
  {
    title: "Static Bloom",
    genre: "Electronic",
    mood: "Euphoric",
    bpm: 124,
    price: 69,
    license: "Premium lease",
    color: "from-[#773c90] via-[#b85a9b] to-[#432254]",
    icon: SlidersHorizontal,
  },
];
const selectClass =
  "mt-2 w-full appearance-none rounded-md border border-white/10 bg-[#4c4c50] px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent";

export default function BeatsPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All genres");
  const [price, setPrice] = useState("Any price");
  const [bpm, setBpm] = useState("Any BPM");
  const [license, setLicense] = useState("All licenses");
  const [sort, setSort] = useState("Featured");
  const [playing, setPlaying] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const filteredBeats = beats
    .filter(
      (beat) =>
        `${beat.title} ${beat.genre} ${beat.mood}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (genre === "All genres" || beat.genre === genre) &&
        (price === "Any price" ||
          (price === "Under $50" ? beat.price < 50 : beat.price >= 50)) &&
        (bpm === "Any BPM" ||
          (bpm === "Under 90 BPM" ? beat.bpm < 90 : beat.bpm >= 90)) &&
        (license === "All licenses" || beat.license === license),
    )
    .sort((first, second) =>
      sort === "Price: Low"
        ? first.price - second.price
        : sort === "Price: High"
          ? second.price - first.price
          : 0,
    );
  const addToCart = (title: string) => {
    setCart((current) =>
      current.includes(title) ? current : [...current, title],
    );
    setIsCartOpen(true);
  };
  const removeFromCart = (title: string) =>
    setCart((current) => current.filter((item) => item !== title));
  const cartBeats = beats.filter((beat) => cart.includes(beat.title));
  const cartTotal = cartBeats.reduce((total, beat) => total + beat.price, 0);
  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    window.addEventListener("open-cart", openCart);
    return () => window.removeEventListener("open-cart", openCart);
  }, []);
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cart-count-change", { detail: cart.length }),
    );
  }, [cart.length]);
  return (
    <main id="top" className="min-h-screen bg-bg text-primary">
      <section className="mx-auto max-w-360 px-5 pb-16 pt-14 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              The catalogue
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Find your next sound.
            </h1>
            <p className="mt-2 text-sm text-muted">
              Premium beats, ready for your story.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:w-64">
              <span className="sr-only">Search beats</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search beats..."
                className="h-9 w-full rounded-md border border-white/10 bg-surface pl-9 pr-3 text-sm text-primary outline-none placeholder:text-muted focus:border-accent"
              />
            </label>
            <label className="relative block sm:w-40">
              <span className="sr-only">Sort beats</span>
              <SlidersHorizontal className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-9 w-full appearance-none rounded-md border border-white/10 bg-surface pl-9 pr-8 text-sm text-primary outline-none"
              >
                <option>Featured</option>
                <option>Price: Low</option>
                <option>Price: High</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </label>
          </div>
        </div>
        <div className="grid gap-7 lg:grid-cols-[198px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-surface p-5 lg:min-h-142.5">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filter beats</h2>
              <Filter className="size-4 text-muted" />
            </div>
            <FilterSelect
              label="Genre"
              value={genre}
              setValue={setGenre}
              options={["All genres", "R&B", "Hip Hop", "Pop", "Electronic"]}
            />
            <FilterSelect
              label="Price range"
              value={price}
              setValue={setPrice}
              options={["Any price", "Under $50", "$50 and up"]}
            />
            <FilterSelect
              label="BPM"
              value={bpm}
              setValue={setBpm}
              options={["Any BPM", "Under 90 BPM", "90 BPM and up"]}
            />
            <FilterSelect
              label="License type"
              value={license}
              setValue={setLicense}
              options={["All licenses", "Basic lease", "Premium lease"]}
            />
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs text-muted">Popular moods</p>
              <div className="flex flex-wrap gap-2">
                {["Dark", "Chill", "Soulful"].map((mood) => (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => setQuery(mood)}
                    className="rounded-md border border-white/40 px-2 py-1 text-xs text-primary hover:border-accent hover:text-accent"
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {filteredBeats.length} beats
                </span>
              </p>
              <span className="hidden items-center gap-2 text-xs text-muted sm:flex">
                <Grid2X2 className="size-4" /> Grid view
              </span>
            </div>
            {filteredBeats.length === 0 ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-muted">
                No beats match those filters.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredBeats.map((beat) => {
                  const Icon = beat.icon;
                  const isPlaying = playing === beat.title;
                  const inCart = cart.includes(beat.title);
                  return (
                    <article
                      key={beat.title}
                      className="overflow-hidden rounded-xl border border-white/5 bg-surface shadow-lg shadow-black/10"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedBeat(beat)}
                        className={`relative flex h-48 w-full items-center justify-center bg-linear-to-br ${beat.color}`}
                      >
                        <Icon
                          className="size-20 text-white/35"
                          strokeWidth={1.5}
                        />
                        {beat.featured && (
                          <span className="absolute left-3 top-3 rounded border border-white bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                            Featured
                          </span>
                        )}
                      </button>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedBeat(beat)}
                              className="font-semibold text-primary hover:text-accent"
                            >
                              {beat.title}
                            </button>
                            <p className="mt-1 text-xs text-muted">
                              {beat.genre} · {beat.mood}
                            </p>
                          </div>
                          <strong className="text-base text-primary">
                            ${beat.price}
                          </strong>
                        </div>
                        <div className="mt-4 flex justify-between text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Headphones className="size-3.5" /> {beat.bpm} BPM
                          </span>
                          <span>{beat.license}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            aria-label={`${isPlaying ? "Pause" : "Play"} ${beat.title}`}
                            onClick={() =>
                              setPlaying(isPlaying ? null : beat.title)
                            }
                            className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-[#111113] text-primary"
                          >
                            {isPlaying ? (
                              <Square className="size-3 fill-current" />
                            ) : (
                              <Play className="ml-0.5 size-4 fill-current" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCart(beat.title)}
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#111113] text-sm font-semibold text-primary hover:bg-accent hover:text-bg"
                          >
                            {inCart ? (
                              <Check className="size-4" />
                            ) : (
                              <ShoppingCart className="size-4" />
                            )}
                            {inCart ? "Added to Cart" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="mt-5 w-full rounded-2xl border border-white/10 bg-surface p-5 text-left sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Your cart</h2>
                  <p className="mt-1 text-xs text-muted">
                    {cart.length
                      ? `${cart.length} beat${cart.length === 1 ? "" : "s"} ready for checkout.`
                      : "Ready when you are."}
                  </p>
                </div>
                <ShoppingCart className="size-5 text-muted" />
              </div>
              {cart.length === 0 && (
                <p className="mt-9 text-sm text-muted">
                  Your cart is empty. Add a beat to get started.
                </p>
              )}
            </button>
          </div>
        </div>
      </section>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60"
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-surface p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your cart</h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            {cartBeats.length === 0 ? (
              <p className="mt-12 text-sm text-muted">
                Your cart is empty. Add a beat to get started.
              </p>
            ) : (
              <>
                <div className="mt-8 space-y-4">
                  {cartBeats.map((beat) => (
                    <div
                      key={beat.title}
                      className="flex items-center justify-between border-b border-white/10 pb-4"
                    >
                      <div>
                        <p className="text-sm font-semibold">{beat.title}</p>
                        <p className="mt-1 text-xs text-muted">
                          {beat.license}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">${beat.price}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${beat.title}`}
                          onClick={() => removeFromCart(beat.title)}
                        >
                          <X className="size-4 text-muted hover:text-accent" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-4 flex justify-between text-sm">
                    <span className="text-muted">Total</span>
                    <strong>${cartTotal}</strong>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-bg"
                  >
                    Continue to checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      {selectedBeat && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 p-5"
          onClick={() => setSelectedBeat(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-surface"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`relative flex h-48 items-center justify-center bg-linear-to-br ${selectedBeat.color}`}
            >
              <selectedBeat.icon className="size-24 text-white/35" />
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedBeat(null)}
                className="absolute right-4 top-4 rounded-full bg-black/30 p-2"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                {selectedBeat.genre} · {selectedBeat.mood}
              </p>
              <div className="mt-2 flex justify-between gap-4">
                <h2 className="text-2xl font-semibold">{selectedBeat.title}</h2>
                <strong className="text-xl">${selectedBeat.price}</strong>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                A carefully shaped {selectedBeat.mood.toLowerCase()} production
                at {selectedBeat.bpm} BPM, ready for your next release.
              </p>
              <button
                type="button"
                onClick={() => {
                  addToCart(selectedBeat.title);
                  setSelectedBeat(null);
                }}
                className="mt-6 w-full rounded-md bg-accent py-3 text-sm font-semibold text-bg"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function FilterSelect({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="mt-5 block text-xs text-muted">
      {label}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={selectClass}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </div>
    </label>
  );
}
