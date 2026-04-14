"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-[var(--accent)] transition-opacity hover:opacity-80"
        >
          &gt; tswart<span className="animate-pulse">_</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm transition-colors ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md sm:hidden hover:bg-[var(--surface-alt)] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={mobileOpen ? "open" : "closed"}
              className="flex flex-col gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-px w-5 bg-[var(--fg)] origin-center"
                  variants={{
                    open: {
                      rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                      y: i === 0 ? 6 : i === 2 ? -6 : 0,
                      opacity: i === 1 ? 0 : 1,
                    },
                    closed: { rotate: 0, y: 0, opacity: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[var(--border)] sm:hidden"
          >
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-6 py-3 text-sm transition-colors ${
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
