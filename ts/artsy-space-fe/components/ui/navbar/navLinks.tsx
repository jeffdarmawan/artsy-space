// package
import Link from "next/link";
import { usePathname } from "next/navigation";

// ui
import NavDropdown from "@/ui/navbar/navDropdown";
import { NavLinkProps } from "@/ui/navbar/definition";

// lib
import { cn } from "@/lib/utils";

const links: NavLinkProps[] = [
  {
    id: "marketplace",
    path: "/marketplace",
    name: "Marketplace",
  },
  {
    id: "crowdfund",
    path: "/crowdfund",
    name: "Crowdfund",
  },
  {
    id: "profile",
    path: "/profile",
    name: "Profile",
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex lg:justify-center lg:gap-10">
      {links.map((link) => (
        <li
          key={link.id}
          className={cn(
            "font-inter text-sm font-medium text-[#141718] hover:opacity-100",
            pathname !== link.path && "opacity-70",
          )}
        >
          {link.subLinks ? (
            <NavDropdown link={link} />
          ) : (
            <Link href={link.path}>{link.name}</Link>
          )}
        </li>
      ))}
    </ul>
  );
}
