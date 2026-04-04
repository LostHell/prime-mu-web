"use client";

import Logo from "@/components/logo";
import LogoutButton from "@/components/logout-button";
import { BRAND } from "@/constants/app";
import { Page } from "@/types/navitaion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

type NavigationProps = {
  pages: Page[];
  isAuthenticated: boolean;
};
const Navigation: FC<NavigationProps> = ({ pages, isAuthenticated }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const activeLink = (path: string) => {
    return pathname === path ? "active" : "";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-serif text-xl font-bold gold-gradient-text">{BRAND}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {pages.map((item) => (
            <Link key={item.path} href={item.path} className={`nav-link ${activeLink(item.path)}`}>
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/user-panel" className={`nav-link ${activeLink("/user-panel")}`}>
                User Panel
              </Link>
              <LogoutButton className="nav-link inline bg-transparent p-0 font-inherit text-inherit border-0 cursor-pointer" />
            </>
          ) : (
            <>
              <Link href="/login" className={`nav-link ${activeLink("/login")}`}>
                Login
              </Link>
              <Link href="/register" className={`nav-link ${activeLink("/register")}`}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground p-2" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="p-4 space-y-4">
            {pages.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={toggleMobileMenu}
                className={`block nav-link ${activeLink(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/user-panel"
                  onClick={toggleMobileMenu}
                  className={`block nav-link ${activeLink("/user-panel")}`}
                >
                  User Panel
                </Link>
                <LogoutButton
                  className="block w-full text-left nav-link bg-transparent p-0 font-inherit text-inherit border-0 cursor-pointer"
                  onClick={toggleMobileMenu}
                />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={toggleMobileMenu}
                  className={`block nav-link ${activeLink("/login")}`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={toggleMobileMenu}
                  className={`block nav-link ${activeLink("/register")}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
