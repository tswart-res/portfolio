import Link from "next/link";
import Image from "next/image";
import type { ProjectMeta } from "@/lib/mdx";

interface ProjectCardProps {
  project: ProjectMeta;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:border-[var(--accent)] hover:shadow-[0_0_20px_oklch(74%_0.17_200_/_12%)]">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[var(--surface-alt)] overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--border)] text-xs font-mono">
            no preview
          </div>
        )}

        {/* Status badge */}
        {project.status !== "completed" && (
          <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-[var(--surface)]/80 text-[var(--muted)] font-mono backdrop-blur-sm">
            {project.status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/*
          Title link with ::after stretched to cover the whole card.
          The card has position:relative so ::after (absolute + inset-0) fills it.
          This avoids nested <a> while keeping the whole card clickable.
        */}
        <h3 className="font-semibold text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-[var(--muted)] mb-4 flex-1 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links row - relative + z-10 lifts these above the ::after overlay */}
        <div className="relative z-10 flex gap-3 text-xs font-mono text-[var(--muted)]">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              live ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              repo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
