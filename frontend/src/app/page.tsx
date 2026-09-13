import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main id="top" className="overflow-hidden">
      <Navbar />
      <section className="relative border-b border-white/10 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute -right-32 top-12 size-96 rounded-full border border-accent/20 sm:size-128" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-10 bg-accent" /> Independent sound,
              carefully made
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-primary sm:text-7xl">
              Make the room
              <br />
              <span className="text-accent">remember you.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-muted sm:text-lg">
              Original beats, polished production, and a sound that leaves
              fingerprints. Built for artists who are ready to move differently.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/beats"
                className="inline-flex items-center gap-3 rounded-button bg-accent px-5 py-3 text-sm font-semibold text-bg"
              >
                Explore the sound <ArrowUpRight className="size-4" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-button border border-white/20 px-5 py-3 text-sm font-semibold text-primary hover:border-accent"
              >
                Work with us
              </a>
            </div>
          </div>
          <div className="relative hidden min-h-72 items-end justify-end lg:flex">
            <Image
              src="/images/RumanLogo.png"
              alt="Ruman Music Productions"
              width={2200}
              height={700}
              className="w-full max-w-xl object-contain opacity-90"
            />
            <p className="absolute bottom-0 right-0 max-w-44 text-right text-xs uppercase leading-5 tracking-[0.18em] text-muted">
              From first note
              <br />
              to final master
            </p>
          </div>
        </div>
      </section>
      <section id="about" className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              The studio
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Find your frequency.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-muted md:col-span-2">
            Ruman Production is a sound lab for artists who want more from every
            note. Explore the catalogue, find the right pulse, and make
            something that lasts.
          </p>
        </div>
      </section>
      <section
        id="contact"
        className="border-t border-white/10 bg-surface px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Start a session
            </p>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-primary sm:text-5xl">
              Bring the idea.
              <br />
              We&apos;ll bring the detail.
            </h2>
          </div>
          <a
            href="mailto:hello@rumanproduction.com"
            className="inline-flex w-fit items-center gap-3 border-b border-accent pb-2 text-sm font-semibold text-primary"
          >
            hello@rumanproduction.com <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
