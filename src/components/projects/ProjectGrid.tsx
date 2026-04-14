"use client";

import { useState } from "react";
import type { ProjectMeta } from "@/lib/mdx";
import ProjectCard from "./ProjectCard";
import TagFilter from "./TagFilter";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface ProjectGridProps {
  projects: ProjectMeta[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags from all projects
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).sort();

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  return (
    <div>
      {allTags.length > 0 && (
        <TagFilter tags={allTags} activeTag={activeTag} onSelect={setActiveTag} />
      )}

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)] text-sm font-mono">
          No projects match the selected filter.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.05}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
