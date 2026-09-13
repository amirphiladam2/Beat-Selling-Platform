"use client";
import { AudioLines, Menu, ShoppingCart, X } from "lucide-react";
import Container from "./Container";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Beats", href: "/beats" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      setCartCount(customEvent.detail);
    };

    window.addEventListener("cart-count-change", updateCartCount);
    return () =>
      window.removeEventListener("cart-count-change", updateCartCount);
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/90 backdrop-blur-md">
      <Container className="px-5 sm:px-8">
        <nav className="flex min-h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex size-10 items-center justify-center rounded-button bg-accent text-bg">
              <AudioLines className="size-5" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold tracking-tight text-primary">
                Ruman Production
              </p>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">
                Sound Lab
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="rounded-button p-2 text-primary md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <ul
            className={`${isOpen ? "absolute left-0 right-0 top-20 flex border-b border-white/10 bg-bg px-5 pb-6 pt-3 sm:px-8" : "hidden"} flex-col gap-5 md:static md:flex md:flex-row md:items-center md:gap-9 md:border-0 md:bg-transparent md:p-0`}
          >
            {navItems.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/auth"
                className="inline-flex rounded-button border border-accent/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-bg"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
            </li>
            <li>
              <button
                type="button"
                aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ""}`}
                onClick={() => window.dispatchEvent(new Event("open-cart"))}
                className="relative text-primary transition-colors hover:text-accent"
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold leading-none text-bg">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
