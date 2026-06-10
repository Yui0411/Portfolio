"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Hardcoded primary navigation. The links never change, so there's no need
// to load them from the database.
const links = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certificates" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-6">
        {links.map((link) => {
          // "/" should only match exactly; the others match their sub-paths too.
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-3 text-sm transition-colors ${
                active
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {link.label}
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-foreground" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
