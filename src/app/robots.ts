import type { MetadataRoute } from "next";

// Force dynamic - same reason as sitemap.ts (reads NEXT_PUBLIC_SITE_URL at runtime).
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
