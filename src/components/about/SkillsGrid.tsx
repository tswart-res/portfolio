import AnimatedSection from "@/components/shared/AnimatedSection";

const skillCategories = [
  {
    name: "Core Stack",
    skills: ["Python", "Django", "PostgreSQL", "SQL", "SQLAlchemy"],
  },
  {
    name: "Ingestion & Scraping",
    skills: ["Airflow", "HTTPX", "BeautifulSoup", "Playwright", "spaCy", "REST APIs", "PDF parsing"],
  },
  {
    name: "Infrastructure & Ops",
    skills: ["Docker", "Grafana", "Loki", "GitHub Actions", "Linux", "AWS EC2", "AWS RDS", "CloudWatch"],
  },
  {
    name: "Visualisation",
    skills: ["D3.js", "Streamlit", "QuickSight", "Power BI", "Superset"],
  },
];

export default function SkillsGrid() {
  return (
    <AnimatedSection className="mb-16" delay={0.1}>
      <h2 className="text-xl font-bold text-[var(--fg)] mb-6 font-mono">
        &gt; skills
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {skillCategories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <p className="text-xs text-[var(--accent)] font-mono uppercase tracking-widest mb-3">
              {cat.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 rounded-md bg-[var(--surface-alt)] text-[var(--muted)] font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
