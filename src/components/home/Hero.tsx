"use client";

import { motion, type Variants } from "motion/react";
import Link from "next/link";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-6 max-w-2xl"
      >
        {/* Name */}
        <motion.h1
          variants={item}
          className="text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="text-[var(--fg)]">Tom </span>
          <span className="text-[var(--accent)]">Swart</span>
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={item}
          className="font-mono text-lg text-[var(--muted)]"
        >
          Data Engineer
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={item}
          className="text-base text-[var(--muted)] max-w-lg leading-relaxed"
        >
          I build data ingestion pipelines, Django/PostgreSQL platforms, and
          scraping workflows - turning messy, unreliable data into
          production-ready systems. Currently founding Grocery Lens and
          available for contract work.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex gap-4 flex-wrap justify-center mt-2">
          <Link
            href="/projects"
            className="rounded-md border border-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent)] transition-all hover:bg-[var(--accent-dim)] hover:shadow-[0_0_20px_oklch(74%_0.17_200_/_15%)]"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
          >
            Contact Me
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col gap-1 items-center text-[var(--border)]"
          >
            <span className="text-xs font-mono text-[var(--muted)]">scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
