import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Twitter,
  Facebook,
  Instagram,
  Twitch,
} from 'lucide-react';
import SearchBar from './src'; // ajustează dacă ai alta cale
import { Link } from 'react-router-dom';

export default function HeroNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'ACASĂ', to: '/' },
    { label: 'DESPRE', to: '/despr' },
    { label: 'FAQ', to: '/qa' },
    { label: 'CONTACT', to: '/callme' },
  ]

  return (
    <header className="bg-[#dcd0c0] text-[#3a2c27] w-full">
      {/* Topbar */}
      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto px-4 py-4 z-50 relative">
        {/* Left: burger + search */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>

        {/* Middle: logo */}
        <div className="flex justify-center">
          <h1
            className="text-4xl md:text-6xl font-lovers text-center"
            style={{ fontFamily: '"Lovers Quarrel", cursive' }}>
        <Link to='/'> Ask Me Anything </Link>
          </h1>
        </div>

        {/* Right: socials */}
        <div className="flex justify-end gap-3 items-center">
          {/* Mobile icons */}
          {/* <div className="flex gap-3 md:hidden"> */}
          <div className="flex flex-grow gap-3 md:hidden">
            {/* <Search size={25} /> */}
            {/* <div className="flex-grow"> */}
    <SearchBar mobile />
  {/* </div> */}

            <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook" className="hover:scale-115 transition">
    <Facebook size={25} />
  </a>
  <a href="https://github.com/mariateodorapopescu" aria-label="Twitter" className="hover:scale-115 transition">
    <Twitter size={25} />
</a>
          </div>

          {/* Desktop icons */}
          <div className="hidden md:flex gap-3">
          <a href="https://heyitsmemariap.netlify.app/" aria-label="Facebook" className="hover:scale-115 transition">
    <Facebook size={25} />
  </a>

  <a href="https://resumepmt.netlify.app/" aria-label="Instagram" className="hover:scale-115 transition">
    <Instagram size={25} />
  </a>
            <a href="https://github.com/mariateodorapopescu" aria-label="Twitter" className="hover:scale-115 transition">
    <Twitter size={25} />
</a>
{/* <a href="/login" aria-label="Twitch" className="hover:scale-115 transition">
    <Twitch size={25} />
  </a> */}
          </div>
        </div>
      </div>

      {/* Desktop nav bar */}
      {/* border-[#b3a89c] */}
      <nav className="hidden md:flex justify-center border-b border-[#b3a89c] pb-4">
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `font-montserrat block px-6 py-2 transition-colors duration-200 ${
                isActive
                  ? 'border-b-2 border-[#3a2c27] text-[#3a2c27]'
                  : 'text-[#755c50] hover:text-[#3a2c27] hover:border-b-2 hover:border-[#3a2c27]'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile overlay nav */}
      {isOpen && (
        <div className="fixed inset-0 min-h-screen z-40 flex flex-col justify-between bg-[#dcd0c0] text-[#3a2c27] md:hidden mt-8 pt-20 pb-8">
          <div className="flex flex-col gap-6 text-xl font-light">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full text-left px-12 py-4 mt-0 transition-colors duration-200 ${
                    isActive ? 'bg-[#beb3a6]' : 'hover:bg-[#beb3a6]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Socials in footer */}
          <div className="flex px-12 py-8 bg-[#beb3a6]">
          <a href="https://resumepmt.netlify.app/" aria-label="Instagram" className="hover:scale-115 transition">
    <Instagram size={25} />
  </a>

            {/* <a href="/login" aria-label="Twitch" className="hover:scale-115 transition">
    <Twitch size={25} />
  </a> */}
          </div>
        </div>
      )}
    </header>
  )
}
