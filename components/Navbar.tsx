import Link from "next/link";
import { useRouter } from "next/router";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/reading", label: "Reading" },
  { href: "/library", label: "Library" },
  { href: "/deep-dives", label: "Deep Dives" },
];

function NavLinks() {
  const { pathname } = useRouter();

  return LINKS.map((link) => {
    const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
    return (
      <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>
        {link.label}
      </Link>
    );
  });
}

export default function Navbar() {
  return (
    <>
      <nav className="topbar" aria-label="Main">
        <NavLinks />
      </nav>
      <nav className="sidebar" aria-label="Main">
        <p className="sidebar-label">NAVIGATION</p>
        <div className="sidebar-links">
          <NavLinks />
        </div>
      </nav>
    </>
  );
}
