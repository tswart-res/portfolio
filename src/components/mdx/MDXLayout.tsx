import Link from "next/link";
import Image from "next/image";
import type { ProjectFrontmatter } from "@/lib/schema";
import ProjectVideo from "@/components/projects/ProjectVideo";

interface MDXLayoutProps {
  frontmatter: ProjectFrontmatter;
  children: React.ReactNode;
}

export default function MDXLayout({ frontmatter, children }: MDXLayoutProps) {
  const { title, date, tags, thumbnail, videoDemo, liveUrl, repoUrl, status } =
    frontmatter;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        ← Back to projects
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <time
            dateTime={date}
            className="font-mono text-xs text-[var(--muted)]"
          >
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </time>
          {status !== "completed" && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)] font-mono">
              {status}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-[var(--fg)] mb-4">{title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* External links */}
        <div className="flex gap-4 text-sm font-mono text-[var(--muted)]">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              View live ↗
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Source code ↗
            </a>
          )}
        </div>
      </header>

      {/* Hero media */}
      {videoDemo ? (
        <div className="mb-10">
          <ProjectVideo
            src={videoDemo}
            poster={thumbnail}
          />
        </div>
      ) : thumbnail ? (
        <div className="relative aspect-video mb-10 overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)]">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}

      {/* MDX prose content */}
      <div className="prose dark:prose-invert max-w-none prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)] prose-code:font-mono prose-code:text-[var(--accent)] prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline">
        {children}
      </div>
    </article>
  );
}
