import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectBySlug } from "@/lib/mdx";
import MDXLayout from "@/components/mdx/MDXLayout";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import PageTransition from "@/components/shared/PageTransition";

// In Next.js 15+/16, params is a Promise - must be awaited
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <PageTransition>
      <MDXLayout frontmatter={project}>
        <MDXRemote source={project.content} components={mdxComponents} />
      </MDXLayout>
    </PageTransition>
  );
}
