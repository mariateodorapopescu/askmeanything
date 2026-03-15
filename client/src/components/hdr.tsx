import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Twitter,
  Facebook,
  Instagram,
  Search,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Definiți paginile site-ului vostru aici.
// Adăugați oricâte pagini vreți în viitor.
// ─────────────────────────────────────────────
const SITE_PAGES = [
  { label: 'Acasă',   to: '/',       keywords: ['acasa', 'home', 'start', 'principal'] },
  { label: 'Despre',  to: '/despr',  keywords: ['despre', 'about', 'info', 'informatii'] },
  { label: 'FAQ',     to: '/qa',     keywords: ['faq', 'intrebari', 'raspunsuri', 'qa', 'ajutor', 'help'] },
  { label: 'Contact', to: '/callme', keywords: ['contact', 'mesaj', 'email', 'scrie'] },
];

// ─────────────────────────────────────────────
// Funcție de căutare pe site
// Returnează prima pagină care se potrivește
// cu query-ul utilizatorului.
// ─────────────────────────────────────────────
function findSitePage(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  return SITE_PAGES.find(
    (page) =>
      page.label.toLowerCase().includes(q) ||
      page.to.toLowerCase().includes(q) ||
      page.keywords.some((kw) => kw.includes(q) || q.includes(kw))
  ) ?? null;
}

export default function HeroNavbar() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query,        setQuery]        = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'ACASĂ',   to: '/'       },
    { label: 'DESPRE',  to: '/despr'  },
    { label: 'FAQ',     to: '/qa'     },
    { label: 'CONTACT', to: '/callme' },
  ];

  // Focus automat pe input când se deschide search-ul
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Închide search cu Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function openSearch()  { setIsSearchOpen(true); }
  function closeSearch() { setIsSearchOpen(false); setQuery(''); }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // 1️⃣ Încearcă mai întâi pe site
    const sitePage = findSitePage(trimmed);

    if (sitePage) {
      navigate(sitePage.to);
      closeSearch();
    } else {
      // 2️⃣ Fallback: caută pe Google, în tab nou
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
      window.open(googleUrl, '_blank', 'noopener,noreferrer');
      closeSearch();
    }
  }

  return (
    <header className="bg-[#dcd0c0] text-[#3a2c27] w-full">

      {/* ── TOPBAR ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-4 z-50 relative">

        {/* ── SEARCH OVERLAY (înlocuiește întregul topbar) ────── */}
        {isSearchOpen ? (
          <div className="flex items-center gap-3 w-full animate-fadeIn">

            {/* Bara de căutare full-width */}
            <form
              onSubmit={handleSearch}
              // className="flex flex-1 items-center border-2 border-[#3a2c27] bg-[#dcd0c0]"
               className="flex flex-1 items-center border-2 border-[#3a2c2700] bg-[#dcd0c0]"
              style={{ minHeight: '52px' }}
            >
              {/* Input text */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="
                  flex-1 px-4 py-2
                  bg-transparent border border-[#3a2c27] rounded-full outline-none
                  placeholder-[#9c8f86] text-[#755c50]
                  font-montserrat text-sm tracking-wide
                "
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                aria-label="Search input"
              />

               {/* hidden md:flex items-center gap-2
                  border border-[#3a2c27] rounded-full
                  px-4 py-2 text-sm text-[#755c50]
                  hover:bg-[#c5b9b0] hover:text-[#3a2c27]
                  transition-colors duration-200 */}


              {/* ─ Separator vertical ─ */}
              {/* <div className="w-px self-stretch bg-[#3a2c27]" /> */}

              {/* Buton lupă (submit) */}
              <button
                type="submit"
                className="px-4 py-3 hover:bg-[#c5b9b0] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>

            {/* X – în afara barei, la dreapta */}
            <button
              type="button"
              onClick={closeSearch}
              className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>

        ) : (
          /* ── TOPBAR NORMAL (3 coloane) ──────────────────────── */
          <div className="grid grid-cols-3 items-center">

            {/* Stânga: burger (mobil) + search (desktop) */}
            <div className="flex items-center gap-3">
              {/* Burger – doar pe mobil */}
              <button
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Buton search desktop – aspect pill */}
              <button
                onClick={openSearch}
                className="
                  hidden md:flex items-center gap-2
                  border border-[#3a2c27] rounded-full
                  px-4 py-2 text-sm text-[#755c50]
                  hover:bg-[#c5b9b0] hover:text-[#3a2c27]
                  transition-colors duration-200
                "
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                aria-label="Open search"
              >
                <Search size={15} />
                <span>Caută...</span>
              </button>

              {/* Buton search mobil – doar iconița */}
              <button
                onClick={openSearch}
                className="md:hidden p-1 hover:opacity-70 transition"
                aria-label="Open search"
              >
                <Search size={22} />
              </button>
            </div>

            {/* Centru: Logo */}
            <div className="flex justify-center">
              <h1
                className="text-4xl md:text-6xl text-center"
                style={{ fontFamily: '"Lovers Quarrel", cursive' }}
              >
                <Link to="/">Ask Me Anything</Link>
              </h1>
            </div>

            {/* Dreapta: rețele sociale */}
            <div className="flex justify-end gap-3 items-center">
              {/* Desktop */}
              <div className="hidden md:flex gap-3">
                <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook"  className="hover:scale-110 transition-transform">
                  <Facebook size={25} />
                </a>
                <a href="https://resumepmt.netlify.app/"       aria-label="Instagram" className="hover:scale-110 transition-transform">
                  <Instagram size={25} />
                </a>
                <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
                  <Twitter size={25} />
                </a>
              </div>

              {/* Mobil */}
              <div className="flex md:hidden gap-3">
                <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook" className="hover:scale-110 transition-transform">
                  <Facebook size={25} />
                </a>
                <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
                  <Twitter size={25} />
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
      {/* ── END TOPBAR ─────────────────────────────────────────── */}

      {/* ── NAVBAR DESKTOP ─────────────────────────────────────── */}
      <nav className="hidden md:flex justify-center border-b border-[#b3a89c] pb-4">
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-6 py-2 transition-colors duration-200 ${
                isActive
                  ? 'border-b-2 border-[#3a2c27] text-[#3a2c27]'
                  : 'text-[#755c50] hover:text-[#3a2c27] hover:border-b-2 hover:border-[#3a2c27]'
              }`
            }
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── MOBILE OVERLAY NAV ─────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 min-h-screen z-40 flex flex-col justify-between bg-[#dcd0c0] text-[#3a2c27] md:hidden mt-8 pt-20 pb-8">
          <div className="flex flex-col gap-6 text-xl font-light">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left px-12 py-4 transition-colors duration-200 ${
                    isActive ? 'bg-[#beb3a6]' : 'hover:bg-[#beb3a6]'
                  }`
                }
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Social icons în footer-ul meniului mobil */}
          <div className="flex gap-4 px-12 py-8 bg-[#beb3a6]">
            <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook"  className="hover:scale-110 transition-transform">
              <Facebook size={25} />
            </a>
            <a href="https://resumepmt.netlify.app/"       aria-label="Instagram" className="hover:scale-110 transition-transform">
              <Instagram size={25} />
            </a>
            <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
              <Twitter size={25} />
            </a>
          </div>
        </div>
      )}

      {/*
        ── ANIMAȚIE fadeIn (adaugă în globals.css sau tailwind.config.js) ──
        @keyframes fadeIn {
          from { opacity: 0; transform: scaleX(0.96); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out forwards;
          transform-origin: left center;
        }
      */}
    </header>
  );
}