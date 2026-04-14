import { z } from "zod";

// Zod v4 - error API changed: use .error() instead of .message() for custom messages
export const projectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  videoDemo: z.string().optional(),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  status: z
    .enum(["completed", "in-progress", "archived"])
    .default("completed"),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;
