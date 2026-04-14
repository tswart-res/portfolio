"use client";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, activeTag, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`text-xs px-3 py-1.5 rounded-full font-mono transition-colors ${
          activeTag === null
            ? "bg-[var(--accent)] text-[var(--bg)]"
            : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag === activeTag ? null : tag)}
          className={`text-xs px-3 py-1.5 rounded-full font-mono transition-colors ${
            activeTag === tag
              ? "bg-[var(--accent)] text-[var(--bg)]"
              : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
