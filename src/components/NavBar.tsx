import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft } from "lucide-react";

const sections = [
  { num: "01.", label: "About", id: "about" },
  { num: "02.", label: "Projects", id: "projects" },
  { num: "03.", label: "Contact", id: "contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="page-center flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-mono text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            eldar.
          </Link>

          {/* Desktop nav */}
          {isHome ? (
            <div className="hidden md:flex items-center gap-8">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer bg-transparent border-none"
                >
                  <span className="font-mono text-cyan-400 text-xs mr-1">
                    {s.num}
                  </span>
                  {s.label}
                </button>
              ))}
              <a
                href="/Eldar_Utiushev_Resume_2026.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-cyan-400 border border-cyan-400/40 rounded px-4 py-1.5 hover:bg-cyan-400/10 transition-colors"
              >
                Resume
              </a>
            </div>
          ) : (
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-400 hover:text-zinc-200 transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
          {isHome ? (
            <>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="text-lg text-zinc-300 hover:text-cyan-400 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <span className="font-mono text-cyan-400 text-sm mr-2">
                    {s.num}
                  </span>
                  {s.label}
                </button>
              ))}
              <a
                href="/Eldar_Utiushev_Resume_2026.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-lg text-cyan-400 border border-cyan-400/40 rounded px-6 py-2 hover:bg-cyan-400/10 transition-colors"
              >
                Resume
              </a>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-lg text-zinc-300 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          )}
        </div>
      )}
    </>
  );
}
