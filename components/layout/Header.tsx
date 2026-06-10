import Link from "next/link";

// Hardcoded site header: your name on the left, contact links on the right.
// TODO: replace the placeholder name / email / links below with your real details.
export default function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Your Name
        </Link>

        <nav className="flex items-center gap-4 text-sm text-foreground/70">
          <a
            href="mailto:you@example.com"
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
