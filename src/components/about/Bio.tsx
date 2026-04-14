import Image from "next/image";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function Bio() {
  return (
    <AnimatedSection className="mb-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative h-28 w-28 rounded-full border-2 border-[var(--accent)] overflow-hidden">
            <Image
              src="/media/about/avatar.png"
              alt="Tom Swart"
              fill
              unoptimized
              className="object-cover object-top"
            />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-[var(--fg)] mb-1">
            Tom Swart
          </h1>
          <p className="font-mono text-sm text-[var(--accent)] mb-4">
            Data Engineer
          </p>
          <div className="space-y-3 text-[var(--muted)] leading-relaxed max-w-prose">
            <p>
              I&apos;m a data engineer specialising in ingestion pipelines,
              Django/PostgreSQL platforms, and scraping workflows. I build
              production-minded systems with proper retries, idempotent loads,
              clear failure modes and observability. For teams that need messy
              data turned into something usable. Currently the founder and lead
              engineer at{" "}
              <span className="text-[var(--fg)]">Grocery Lens</span>.
            </p>
            <p>
              When I&apos;m not writing code, I&apos;m tinkering with homelab
              setups, bouldering, or testing the latest local LLM released on
              HuggingFace.
            </p>
          </div>
          <div className="flex gap-4 mt-6 text-sm">
            <a
              href="https://github.com/tswart-res"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-mono"
            >
              github ↗
            </a>
            <a
              href="https://www.linkedin.com/in/tom-swart-a58053b7/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-mono"
            >
              linkedin ↗
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
