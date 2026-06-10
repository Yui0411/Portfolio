"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/profile", label: "Profile" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-2 gap-y-2 px-6 py-3">
        <span className="mr-2 font-semibold">Admin</span>

        <nav className="flex flex-wrap items-center gap-1">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View site ↗
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
