// import { useState, useRef, useEffect } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import {
//   Menu,
//   X,
//   Twitter,
//   Facebook,
//   Instagram,
//   Search,
// } from 'lucide-react';

// // ─────────────────────────────────────────────
// // Definiți paginile site-ului vostru aici.
// // Adăugați oricâte pagini vreți în viitor.
// // ─────────────────────────────────────────────
// const SITE_PAGES = [
//   { label: 'Acasă',   to: '/',       keywords: ['acasa', 'home', 'start', 'principal'] },
  
//   { label: 'Despre',  to: '/despr',  keywords: ['despre', 'about', 'info', 'informatii'] },
//   { label: 'FAQ',     to: '/qa',     keywords: ['faq', 'intrebari', 'raspunsuri', 'qa', 'ajutor', 'help'] },
//   { label: 'FAQ',     to: '/qa',     keywords: ['faq', 'intrebari', 'raspunsuri', 'qa', 'ajutor', 'help'] },
//   { label: 'Contact', to: '/callme', keywords: ['contact', 'mesaj', 'email', 'scrie'] },
// ];

// // ─────────────────────────────────────────────
// // Funcție de căutare pe site
// // Returnează prima pagină care se potrivește
// // cu query-ul utilizatorului.
// // ─────────────────────────────────────────────
// function findSitePage(query: string) {
//   const q = query.toLowerCase().trim();
//   if (!q) return null;

//   return SITE_PAGES.find(
//     (page) =>
//       page.label.toLowerCase().includes(q) ||
//       page.to.toLowerCase().includes(q) ||
//       page.keywords.some((kw) => kw.includes(q) || q.includes(kw))
//   ) ?? null;
// }

// export default function HeroNavbar() {
//   const [isOpen,       setIsOpen]       = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [query,        setQuery]        = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   const navLinks = [
//     { label: 'ACASĂ',   to: '/'       },
//     { label: 'DESPRE',  to: '/despr'  },
//     { label: 'FAQ',     to: '/qa'     },
//     { label: 'CONTACT', to: '/callme' },
//   ];

//   // Focus automat pe input când se deschide search-ul
//   useEffect(() => {
//     if (isSearchOpen) {
//       setTimeout(() => inputRef.current?.focus(), 50);
//     }
//   }, [isSearchOpen]);

//   // Închide search cu Escape
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') closeSearch();
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   function openSearch()  { setIsSearchOpen(true); }
//   function closeSearch() { setIsSearchOpen(false); setQuery(''); }

//   function handleSearch(e: React.FormEvent) {
//     e.preventDefault();
//     const trimmed = query.trim();
//     if (!trimmed) return;

//     // 1️⃣ Încearcă mai întâi pe site
//     const sitePage = findSitePage(trimmed);

//     if (sitePage) {
//       navigate(sitePage.to);
//       closeSearch();
//     } else {
//       // 2️⃣ Fallback: caută pe Google, în tab nou
//       const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
//       window.open(googleUrl, '_blank', 'noopener,noreferrer');
//       closeSearch();
//     }
//   }

//   return (
//     <header className="bg-[#dcd0c0] text-[#3a2c27] w-full">

//       {/* ── TOPBAR ─────────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 py-4 z-50 relative">

//         {/* ── SEARCH OVERLAY (înlocuiește întregul topbar) ────── */}
//         {isSearchOpen ? (
//           <div className="flex items-center gap-3 w-full animate-fadeIn">

//             {/* Bara de căutare full-width */}
//             <form
//               onSubmit={handleSearch}
//               // className="flex flex-1 items-center border-2 border-[#3a2c27] bg-[#dcd0c0]"
//                className="flex flex-1 items-center border-2 border-[#3a2c2700] bg-[#dcd0c0]"
//               style={{ minHeight: '52px' }}
//             >
//               {/* Input text */}
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search"
//                 className="
//                   flex-1 px-4 py-2
//                   bg-transparent border border-[#3a2c27] rounded-full outline-none
//                   placeholder-[#9c8f86] text-[#755c50]
//                   font-montserrat text-sm tracking-wide
//                 "
//                 style={{ fontFamily: 'Montserrat, sans-serif' }}
//                 aria-label="Search input"
//               />

//                {/* hidden md:flex items-center gap-2
//                   border border-[#3a2c27] rounded-full
//                   px-4 py-2 text-sm text-[#755c50]
//                   hover:bg-[#c5b9b0] hover:text-[#3a2c27]
//                   transition-colors duration-200 */}


//               {/* ─ Separator vertical ─ */}
//               {/* <div className="w-px self-stretch bg-[#3a2c27]" /> */}

//               {/* Buton lupă (submit) */}
//               <button
//                 type="submit"
//                 className="px-4 py-3 hover:bg-[#c5b9b0] transition-colors"
//                 aria-label="Search"
//               >
//                 <Search size={20} />
//               </button>
//             </form>

//             {/* X – în afara barei, la dreapta */}
//             <button
//               type="button"
//               onClick={closeSearch}
//               className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
//               aria-label="Close search"
//             >
//               <X size={24} />
//             </button>
//           </div>

//         ) : (
//           /* ── TOPBAR NORMAL (3 coloane) ──────────────────────── */
//           <div className="grid grid-cols-3 items-center">

//             {/* Stânga: burger (mobil) + search (desktop) */}
//             <div className="flex items-center gap-3">
//               {/* Burger – doar pe mobil */}
//               <button
//                 className="md:hidden"
//                 onClick={() => setIsOpen(!isOpen)}
//                 aria-label="Toggle menu"
//               >
//                 {isOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>

//               {/* Buton search desktop – aspect pill */}
//               <button
//                 onClick={openSearch}
//                 className="
//                   hidden md:flex items-center gap-2
//                   border border-[#3a2c27] rounded-full
//                   px-4 py-2 text-sm text-[#755c50]
//                   hover:bg-[#c5b9b0] hover:text-[#3a2c27]
//                   transition-colors duration-200
//                 "
//                 style={{ fontFamily: 'Montserrat, sans-serif' }}
//                 aria-label="Open search"
//               >
//                 <Search size={15} />
//                 <span>Caută...</span>
//               </button>

//               {/* Buton search mobil – doar iconița */}
//               <button
//                 onClick={openSearch}
//                 className="md:hidden p-1 hover:opacity-70 transition"
//                 aria-label="Open search"
//               >
//                 <Search size={22} />
//               </button>
//             </div>

//             {/* Centru: Logo */}
//             <div className="flex justify-center">
//               <h1
//                 className="text-4xl md:text-6xl text-center"
//                 style={{ fontFamily: '"Lovers Quarrel", cursive' }}
//               >
//                 <Link to="/">Ask Me Anything</Link>
//               </h1>
//             </div>

//             {/* Dreapta: rețele sociale */}
//             <div className="flex justify-end gap-3 items-center">
//               {/* Desktop */}
//               <div className="hidden md:flex gap-3">
//                 <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook"  className="hover:scale-110 transition-transform">
//                   <Facebook size={25} />
//                 </a>
//                 <a href="https://resumepmt.netlify.app/"       aria-label="Instagram" className="hover:scale-110 transition-transform">
//                   <Instagram size={25} />
//                 </a>
//                 <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
//                   <Twitter size={25} />
//                 </a>
//               </div>

//               {/* Mobil */}
//               <div className="flex md:hidden gap-3">
//                 <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook" className="hover:scale-110 transition-transform">
//                   <Facebook size={25} />
//                 </a>
//                 <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
//                   <Twitter size={25} />
//                 </a>
//               </div>
//             </div>

//           </div>
//         )}
//       </div>
//       {/* ── END TOPBAR ─────────────────────────────────────────── */}

//       {/* ── NAVBAR DESKTOP ─────────────────────────────────────── */}
//       {/* <nav className="hidden md:flex justify-center border-b border-[#b3a89c] pb-4">
        

//         {navLinks.map(({ label, to }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `block px-6 py-2 transition-colors duration-200 ${
//                 isActive
//                   ? 'border-b-2 border-[#3a2c27] text-[#3a2c27]'
//                   : 'text-[#755c50] hover:text-[#3a2c27] hover:border-b-2 hover:border-[#3a2c27]'
//               }`
//             }
//             style={{ fontFamily: 'Montserrat, sans-serif' }}
//           >
//             {label}
//           </NavLink>
//         ))}
//       </nav> */}

//         <nav
//         // ref={navRef}  {/* ← ref pentru click-outside */}
//         className="hidden md:flex justify-center border-b border-[#b3a89c] pb-4 relative"
//       >
//         {navLinks.map((item) => (
//           <div key={item.to} className="relative">
 
//             {item.children ? (
//               // ── ITEM CU DROPDOWN (are children) ──────────────
//               <>
//                 {/* Butonul care deschide/închide dropdown */}
//                 <button
//                   onClick={() =>
//                     setOpenDropdown(prev => prev === item.label ? null : item.label)
//                   }
//                   className={`flex items-center gap-1 px-6 py-2 transition-colors duration-200 border-b-2 ${
//                     openDropdown === item.label
//                       ? 'border-[#3a2c27] text-[#3a2c27]'
//                       : 'border-transparent text-[#755c50] hover:text-[#3a2c27] hover:border-[#3a2c27]'
//                   }`}
//                   style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', letterSpacing: '0.08em', fontWeight: 500, background: 'none', cursor: 'pointer' }}
//                   aria-haspopup="true"
//                   aria-expanded={openDropdown === item.label}
//                 >
//                   {item.label}
//                   {openDropdown === item.label
//                     ? <ChevronUp  size={13} />
//                     : <ChevronDown size={13} />
//                   }
//                 </button>
 
//                 {/* Panoul dropdown — apare doar când e deschis */}
//                 {openDropdown === item.label && (
//                   <div
//                     className="absolute left-0 z-50"
//                     style={{
//                       top: 'calc(100% + 17px)',  // imediat sub border-bottom al navului
//                       minWidth: '200px',
//                       backgroundColor: '#e8e0d8',
//                       boxShadow: '0 8px 32px rgba(58,44,39,0.13)',
//                       animation: 'dropdownIn 0.15s ease-out',
//                     }}
//                   >
//                     {item.children.map((child) => (
//                       <NavLink
//                         key={child.to}
//                         to={child.to}
//                         onClick={() => setOpenDropdown(null)}
//                         className={({ isActive }) =>
//                           `block px-7 py-4 text-sm tracking-widest transition-colors duration-150 border-l-2 ${
//                             isActive
//                               ? 'text-[#3a2c27] bg-[#dcd0c0]/40 border-[#3a2c27]'
//                               : 'text-[#755c50] border-transparent hover:text-[#3a2c27] hover:bg-[#dcd0c0]/40'
//                           }`
//                         }
//                         style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
//                       >
//                         {child.label}
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </>
 
//             ) : (
//               // ── ITEM SIMPLU (fără children) ──────────────────
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `block px-6 py-2 transition-colors duration-200 ${
//                     isActive
//                       ? 'border-b-2 border-[#3a2c27] text-[#3a2c27]'
//                       : 'text-[#755c50] hover:text-[#3a2c27] hover:border-b-2 hover:border-[#3a2c27]'
//                   }`
//                 }
//                 style={{ fontFamily: 'Montserrat, sans-serif' }}
//               >
//                 {item.label}
//               </NavLink>
//             )}
 
//           </div>
//         ))}
//       </nav>
//       {/* ── END NAVBAR ──────────────────────────────────────────── */}

//       {/* ── MOBILE OVERLAY NAV ─────────────────────────────────── */}
//       {isOpen && (
//         <div className="fixed inset-0 min-h-screen z-40 flex flex-col justify-between bg-[#dcd0c0] text-[#3a2c27] md:hidden mt-8 pt-20 pb-8">
//           <div className="flex flex-col gap-6 text-xl font-light">
//             {navLinks.map(({ label, to }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 onClick={() => setIsOpen(false)}
//                 className={({ isActive }) =>
//                   `w-full text-left px-12 py-4 transition-colors duration-200 ${
//                     isActive ? 'bg-[#beb3a6]' : 'hover:bg-[#beb3a6]'
//                   }`
//                 }
//                 style={{ fontFamily: 'Montserrat, sans-serif' }}
//               >
//                 {label}
//               </NavLink>
//             ))}
//           </div>

//           {/* Social icons în footer-ul meniului mobil */}
//           <div className="flex gap-4 px-12 py-8 bg-[#beb3a6]">
//             <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook"  className="hover:scale-110 transition-transform">
//               <Facebook size={25} />
//             </a>
//             <a href="https://resumepmt.netlify.app/"       aria-label="Instagram" className="hover:scale-110 transition-transform">
//               <Instagram size={25} />
//             </a>
//             <a href="https://github.com/mariateodorapopescu" aria-label="Twitter"  className="hover:scale-110 transition-transform">
//               <Twitter size={25} />
//             </a>
//           </div>
//         </div>
//       )}

//       {/*
//         ── ANIMAȚIE fadeIn (adaugă în globals.css sau tailwind.config.js) ──
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scaleX(0.96); }
//           to   { opacity: 1; transform: scaleX(1); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.18s ease-out forwards;
//           transform-origin: left center;
//         }
//       */}
//     </header>
//   );
// }

// ---------------------------

import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, Twitter, Facebook, Instagram,
  Search, ChevronUp, ChevronDown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TIPURI – TypeScript
// Un NavItem poate fi simplu (doar to + label)
// sau cu dropdown (are și "children")
// ─────────────────────────────────────────────────────────────
type DropdownItem = { label: string; to: string };
type NavItem      = { label: string; to: string; children?: DropdownItem[] };

// ─────────────────────────────────────────────────────────────
// Paginile site-ului – folosite la căutare
// ─────────────────────────────────────────────────────────────
const SITE_PAGES = [
  { label: 'Acasă',        to: '/',         keywords: ['acasa', 'home']       },
  { label: 'Despre',       to: '/despr',    keywords: ['despre', 'about']     },
  { label: 'FAQ',          to: '/qa',       keywords: ['faq', 'intrebari']    },
  { label: 'Contact',      to: '/callme',   keywords: ['contact', 'mesaj']    },
  { label: 'Bestsellers',  to: '/top',      keywords: ['bestseller', 'top']   },
  { label: 'Articole noi', to: '/nou',      keywords: ['nou', 'new']          },
  { label: 'La reducere',  to: '/reduceri', keywords: ['sale', 'reducere']    },
];

function findSitePage(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return SITE_PAGES.find(p =>
    p.label.toLowerCase().includes(q) ||
    p.to.toLowerCase().includes(q) ||
    p.keywords.some(kw => kw.includes(q) || q.includes(kw))
  ) ?? null;
}

// ─────────────────────────────────────────────────────────────
// COMPONENTA PRINCIPALĂ
// ─────────────────────────────────────────────────────────────
export default function HeroNavbar() {
  const [isOpen,         setIsOpen]         = useState(false);
  const [isSearchOpen,   setIsSearchOpen]   = useState(false);
  const [query,          setQuery]          = useState('');
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const navRef   = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Structura navbarului ───────────────────────────────────
  // "ARTICOLE" are children → va afișa dropdown
  const navLinks: NavItem[] = [
    { label: 'ACASĂ',    to: '/'       },
    {
      label: 'ARTICOLE', to: '/articole',
      children: [
        { label: 'BESTSELLERS',  to: '/top'      },
        { label: 'ARTICOLE NOI', to: '/nou'      },
        { label: 'LA REDUCERE',  to: '/reduceri' },
        { label: 'TOATE',        to: '/articole' },
      ],
    },
    { label: 'DESPRE',   to: '/despr'  },
    { label: 'FAQ',      to: '/qa'     },
    { label: 'CONTACT',  to: '/callme' },
  ];

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeSearch(); setOpenDropdown(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Închide dropdown la click în afara lui
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenDropdown(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function openSearch()  { setIsSearchOpen(true); }
  function closeSearch() { setIsSearchOpen(false); setQuery(''); }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const page = findSitePage(trimmed);
    if (page) { navigate(page.to); closeSearch(); }
    else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(trimmed)}`, '_blank', 'noopener,noreferrer');
      closeSearch();
    }
  }

  return (
    <header style={{ backgroundColor: '#dcd0c0', color: '#3a2c27', width: '100%' }}>

      {/* ── TOPBAR ─────────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', position: 'relative', zIndex: 50 }}>

        {isSearchOpen ? (
          /* ── SEARCH OVERLAY ──────────────────────────────── */
          <div style={{ display: 'flex', alignItems: 'center', animation: 'fadeIn 0.18s ease-out' }}>
            <form
              onSubmit={handleSearch}
              style={{ display: 'flex', flex: 1, alignItems: 'center', borderRadius: '25px', border: '1px solid #3a2c27', backgroundColor: '#dcd0c0', height: '40px', margin: '0 auto', padding: '4px 2px', position: 'relative', top:'0px' }}
            >
               {/* hidden md:flex items-center gap-2
//                   border border-[#3a2c27] rounded-full
//                   px-4 py-2 text-sm text-[#755c50]
//                   hover:bg-[#c5b9b0] hover:text-[#3a2c27]
//                   transition-colors duration-200 */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search"
                style={{ flex: 1, padding: '12px 20px', background: 'transparent', border: 'none', outline: 'none', color: '#3a2c27', fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', letterSpacing: '0.04em' }}
              />
              <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: '#3a2c27' }} />
              <button type="submit" style={{ padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#3a2c27', display: 'flex', alignItems: 'center' }} aria-label="Search">
                <Search size={20} />
              </button>
            </form>
            <button onClick={closeSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2c27' }} aria-label="Close search">
              <X size={24} />
            </button>
          </div>

        ) : (
          /* ── TOPBAR NORMAL (3 coloane) ───────────────────── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>

            {/* Stânga */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setIsOpen(!isOpen)} className="mobile-burger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#3a2c27' }} aria-label="Toggle menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <button onClick={openSearch} className="desktop-search-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #3a2c27', borderRadius: '999px', padding: '8px 16px', background: 'transparent', cursor: 'pointer', color: '#755c50', fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                <Search size={14} /> Caută...
              </button>
              <button onClick={openSearch} className="mobile-search-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#3a2c27' }} aria-label="Search">
                <Search size={22} />
              </button>
            </div>

            {/* Centru: Logo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h1 style={{ fontFamily: '"Lovers Quarrel", cursive', fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0 }}>
                <Link to="/" style={{ color: '#3a2c27', textDecoration: 'none' }}>Ask Me Anything</Link>
              </h1>
            </div>

            {/* Dreapta: Socials */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <div className="desktop-socials" style={{ display: 'flex', gap: '12px' }}>
                <SocialLink href="https://heyitsmemariap.netlify.app/"      label="Facebook" ><Facebook  size={22} /></SocialLink>
                <SocialLink href="https://resumepmt.netlify.app/"           label="Instagram"><Instagram size={22} /></SocialLink>
                <SocialLink href="https://github.com/mariateodorapopescu"   label="Twitter"  ><Twitter   size={22} /></SocialLink>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── NAVBAR DESKTOP ─────────────────────────────────── */}
      <nav ref={navRef} className="desktop-nav" style={{ borderBottom: '1px solid #b3a89c', paddingBottom: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>

          {navLinks.map(item => (
            <div key={item.to} style={{ position: 'relative' }}>

              {item.children ? (
                /* ── ITEM CU DROPDOWN ─────────────────────── */
                <>
                  <button
                    onClick={() => setOpenDropdown(prev => prev === item.label ? null : item.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '8px 24px', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem',
                      letterSpacing: '0.08em', fontWeight: 500,
                      color: openDropdown === item.label ? '#3a2c27' : '#755c50',
                      // borderBottom: openDropdown === item.label ? '2px solid #3a2c27' : '2px solid transparent',
                      transition: 'color 0.2s',
                    }}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    {openDropdown === item.label ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {/* PANOUL DROPDOWN */}
                  {openDropdown === item.label && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 17px)',
                      left: 0,
                      minWidth: '220px',
                      backgroundColor: '#dcd0c0',
                      boxShadow: '0 10px 32px rgba(58,44,39,0.13)',
                      zIndex: 100,
                      animation: 'dropdownIn 0.15s ease-out',
                    }}>
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpenDropdown(null)}
                          style={({ isActive }) => ({
                            display: 'block',
                            padding: '15px 28px',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.8rem',
                            letterSpacing: '0.1em',
                            fontWeight: 500,
                            textDecoration: isActive ? 'underline' : 'none',
                            // color: isActive ? '#3a2c27' : '#755c50',
                            // borderBottom: isActive ? '2px solid #3a2c27' : '2px solid transparent',
                            // backgroundColor: isActive ? 'rgba(58,44,39,0.06)' : 'transparent',
                            // borderLeft: isActive ? '3px solid #3a2c27' : '3px solid transparent',
                            transition: 'background-color 0.15s, color 0.15s',
                          })}
                          onMouseEnter={e => {
                            // (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(58,44,39,0.07)';
                            (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
                            (e.currentTarget as HTMLAnchorElement).style.color = '#3a2c27';
                          }}
                          onMouseLeave={e => {
                            const active = e.currentTarget.getAttribute('aria-current') === 'page';
                            if (!active) {
                              // (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
                              (e.currentTarget as HTMLAnchorElement).style.color = '#755c50';
                            }
                          }}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* ── ITEM SIMPLU ──────────────────────────── */
                <NavLink
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'block', padding: '8px 24px',
                    fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem',
                    letterSpacing: '0.08em', fontWeight: 500,
                    // textDecoration: 'none',
                    color: isActive ? '#3a2c27' : '#755c50',
                    // borderBottom: isActive ? '2px solid #3a2c27' : '2px solid transparent',
                    textDecoration: isActive ? 'underline' : 'none',
                    transition: 'color 0.2s, border-color 0.2s',
                  })}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#3a2c27';
                    // (e.currentTarget as HTMLAnchorElement).style.borderBottom = '2px solid #3a2c27';
                    (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
                  }}
                  onMouseLeave={e => {
                    const active = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = '#755c50';
                      // (e.currentTarget as HTMLAnchorElement).style.borderBottom = '2px solid transparent';
                      (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
                    }
                  }}
                >
                  {item.label}
                </NavLink>
              )}

            </div>
          ))}
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ─────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 min-h-screen z-40 flex flex-col bg-[#dcd0c0] text-[#3a2c27] md:hidden">

          {/* Dacă e deschis un sub-meniu → arată panelul cu sub-iteme */}
          {mobileExpanded ? (
            <div className="flex flex-col flex-1 pt-8">

              {/* Header panel: ← ARTICOLE */}
              <button
                onClick={() => setMobileExpanded(null)}
                className="flex items-center gap-3 px-8 py-5 text-sm tracking-widest font-medium hover:bg-[#beb3a6] transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span className="text-lg">←</span>
                {mobileExpanded}
              </button>

              {/* Linie separator */}
              <div className="h-px bg-[#b3a89c] mx-0" />

              {/* Sub-itemele */}
              <div className="flex flex-col">
                {navLinks
                  .find(item => item.label === mobileExpanded)
                  ?.children?.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => { setIsOpen(false); setMobileExpanded(null); }}
                      className={({ isActive }) =>
                        `block px-10 py-6 text-xl tracking-wide transition-colors ${
                          isActive ? 'bg-[#beb3a6]' : 'hover:bg-[#beb3a6]'
                        }`
                      }
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {child.label}
                    </NavLink>
                  ))}
              </div>
            </div>

          ) : (
            /* Meniul principal */
            <div className="flex flex-col flex-1 justify-between pt-8">
              <div className="flex flex-col">
                {navLinks.map((item) => (
                  <div key={item.to}>
                    {item.children ? (
                      // Item cu sub-meniu → dă click și înlocuiește panelul
                      <button
                        onClick={() => setMobileExpanded(item.label)}
                        className="w-full flex justify-between items-center px-8 py-6 text-xl hover:bg-[#beb3a6] transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {item.label}
                        <span className="text-base">›</span>
                      </button>
                    ) : (
                      // Item simplu
                      <NavLink
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-8 py-6 text-xl transition-colors ${
                            isActive ? 'bg-[#beb3a6]' : 'hover:bg-[#beb3a6]'
                          }`
                        }
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {item.label}
                      </NavLink>
                    )}
                    <div className="h-px bg-[#b3a89c]/40" />
                  </div>
                ))}
              </div>

              {/* Social icons jos */}
              <div className="flex gap-4 px-8 py-8 bg-[#beb3a6]">
                <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook"  className="hover:scale-110 transition-transform"><Facebook  size={25} /></a>
                <a href="https://resumepmt.netlify.app/"       aria-label="Instagram" className="hover:scale-110 transition-transform"><Instagram size={25} /></a>
                <a href="https://github.com/mariateodorapopescu" aria-label="Twitter" className="hover:scale-110 transition-transform"><Twitter   size={25} /></a>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── CSS: animații + responsive ─────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scaleX(0.96); transform-origin: left center; }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .desktop-search-btn { display: flex !important; }
        .mobile-search-btn  { display: none  !important; }
        .mobile-burger      { display: none  !important; }
        .desktop-nav        { display: block !important; }
        .desktop-socials    { display: flex  !important; }

        @media (max-width: 768px) {
          .desktop-search-btn { display: none  !important; }
          .mobile-search-btn  { display: flex  !important; }
          .mobile-burger      { display: flex  !important; }
          .desktop-nav        { display: none  !important; }
          .desktop-socials    { display: none  !important; }
        }
        input::placeholder { color: #9c8f86; }
      `}</style>

    </header>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      style={{ color: '#3a2c27', textDecoration: 'none', display: 'inline-flex', transition: 'transform 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </a>
  );
}