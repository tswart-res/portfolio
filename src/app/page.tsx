import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";

export const metadata: Metadata = {
  title: "Tom Swart | Data Engineer",
  description:
    "Data Engineer building reliable, scalable systems. Explore my projects and get in touch.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
    </>
  );
}
