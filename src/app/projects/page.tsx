import type { Metadata } from "next";
import PageTransition from "@/components/shared/PageTransition";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { getAllProjects } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of software projects I've built - from infrastructure tools to web applications.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[var(--fg)] mb-3">Projects</h1>
          <p className="text-[var(--muted)]">
            Things I&apos;ve designed & shipped.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-[var(--muted)] font-mono text-sm">
            Projects coming soon.
          </p>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </div>
    </PageTransition>
  );
}
