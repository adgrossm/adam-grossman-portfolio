"use client";

import { useEffect, useState } from "react";

const links = ["About", "Projects", "In Progress", "Contact"];
const hrefs: Record<string, string> = {
  About: "#about",
  Projects: "#projects",
  "In Progress": "#in-progress",
  Contact: "#contact",
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b transition-colors duration-300 ${
          scrolled
            ? "border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm"
            : "border-transparent bg-transparent"
        }`}
      >
        <span className="font-mono text-xs tracking-widest text-white/40 uppercase">
          AG
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest uppercase text-white/40">
          {links.map((link) => (
            <a
              key={link}
              href={hrefs[link]}
              className="hover:text-accent transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-px bg-white/50 transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-[6px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-white/50 transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-white/50 transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center items-start px-8 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={hrefs[link]}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-accent transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
