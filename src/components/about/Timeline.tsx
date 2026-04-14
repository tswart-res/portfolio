import AnimatedSection from "@/components/shared/AnimatedSection";

const events = [
  {
    year: "Jul 2025 – present",
    role: "Founder / Lead Data Engineer",
    org: "Grocery Lens",
    description:
      "Building a Django/PostgreSQL data product with custom dietary filters, recipe matching and NLP-assisted ingredient processing. Designed replayable ingestion workflows, privacy-aware analytics, and blue/green deployments with Grafana/Loki observability.",
  },
  {
    year: "2023 – Jun 2025",
    role: "Data Engineer",
    org: "Department for Business & Trade, UK Government",
    description:
      "Led the Data Pipeline Service team (2–3 engineers). Built and maintained Airflow/PostgreSQL/SQLAlchemy pipelines ingesting APIs, S3, GA4, Qualtrics and Comtrade data. Reduced failing pipeline backlog from 50+ to fewer than 10.",
  },
  {
    year: "2023",
    role: "Data Analyst",
    org: "Department for Business & Trade, UK Government",
    description:
      "Built recursive SQL analytics and a D3.js company hierarchy visualiser deployed across the department. Improved Dun & Bradstreet matched-company coverage from ~65% to above 80%.",
  },
  {
    year: "2022 – 2023",
    role: "Junior Data Analyst",
    org: "Department for Business & Trade, UK Government",
    description:
      "Developed QuickSight BI dashboards and delivered SQL/dashboard training through in-house data bootcamps.",
  },
  {
    year: "2019 – 2022",
    role: "PhD Psychology",
    org: "Goldsmiths, University of London",
    description: "",
  },
  {
    year: "2016 – 2017",
    role: "MSc Neuroscience",
    org: "King's College London",
    description: "",
  },
];

export default function Timeline() {
  return (
    <AnimatedSection delay={0.2}>
      <h2 className="text-xl font-bold text-[var(--fg)] mb-6 font-mono">
        &gt; timeline
      </h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />

        <ol className="space-y-8 pl-12">
          {events.map((event, i) => (
            <li key={i} className="relative">
              {/* Dot */}
              <div className="absolute -left-8 top-1 h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)]" />
              <p className="font-mono text-xs text-[var(--accent)] mb-1">
                {event.year}
              </p>
              <p className="font-semibold text-[var(--fg)]">{event.role}</p>
              <p className="text-sm text-[var(--accent)] mb-1">{event.org}</p>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {event.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </AnimatedSection>
  );
}
