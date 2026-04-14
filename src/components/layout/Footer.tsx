export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Tom Swart
        </p>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <a
            href="https://github.com/tswart-res"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/tom-swart-a58053b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
