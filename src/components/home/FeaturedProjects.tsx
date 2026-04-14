import AnimatedSection from "@/components/shared/AnimatedSection";
import Link from "next/link";
import { getAllProjects } from "@/lib/mdx";

export default function FeaturedProjects() {
  const featured = getAllProjects().filter((p) => p.featured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-[var(--fg)]">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-[var(--accent)] hover:underline font-mono"
          >
            View all →
          </Link>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((project, i) => (
          <AnimatedSection key={project.slug} delay={i * 0.1}>
            <Link
              href={`/projects/${project.slug}`}
              className="block rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--accent)] hover:bg-[var(--surface-alt)] group"
            >
              <h3 className="font-semibold text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
