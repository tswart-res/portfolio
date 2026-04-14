import type { Metadata } from "next";
import PageTransition from "@/components/shared/PageTransition";
import Bio from "@/components/about/Bio";
import SkillsGrid from "@/components/about/SkillsGrid";
import Timeline from "@/components/about/Timeline";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about my background, skills, and experience as a Data Engineer.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Bio />
        <SkillsGrid />
        <Timeline />
      </div>
    </PageTransition>
  );
}
