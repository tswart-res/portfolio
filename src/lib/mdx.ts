import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { projectFrontmatterSchema, type ProjectFrontmatter } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export interface ProjectMeta extends ProjectFrontmatter {
  slug: string;
  content: string;
}

function safeParseProject(filePath: string): ProjectMeta | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Zod v4: parse() throws ZodError on failure
  const result = projectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    console.warn(`[mdx] Invalid frontmatter in ${filePath}:`, result.error.issues);
    return null;
  }

  return { ...result.data, slug: result.data.slug, content };
}

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => safeParseProject(path.join(PROJECTS_DIR, file)))
    .filter((p): p is ProjectMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string): ProjectMeta | null {
  if (!fs.existsSync(PROJECTS_DIR)) return null;

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const project = safeParseProject(path.join(PROJECTS_DIR, file));
    if (project?.slug === slug) return project;
  }
  return null;
}
