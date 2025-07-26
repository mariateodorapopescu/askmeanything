import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
// import '../index.css'

export default function SearchBar({ mobile = false }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !(containerRef.current?.contains(event.target as Node))) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Funcția pentru căutarea Google
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Encodăm termenul de căutare pentru URL
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim())
      // Deschidem Google Search într-un tab nou
      window.open(`https://www.google.com/search?q=${encodedSearchTerm}`, '_blank')
      // Resetăm și închidem search bar-ul
      setSearchTerm('')
      setOpen(false)
    }
  }

  // Funcția pentru gestionarea tastei Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // oprește submit-ul nativ
      if (searchTerm.trim()) {
        const encodedSearchTerm = encodeURIComponent(searchTerm.trim())
        window.open(`https://www.google.com/search?q=${encodedSearchTerm}`, '_blank')
        setSearchTerm('')
        setOpen(false)
      }
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setSearchTerm('')
    }
  }  

  // Focusează input-ul când se deschide
  useEffect(() => {
    if (open && inputRef.current) {
        inputRef.current?.focus()
    }
  }, [open])

  // Pentru versiunea mobile
  if (mobile) {
    return (
      <div ref={containerRef} className="flex-1">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="p-1 hover:scale-110 transition-all duration-200"
            aria-label="Deschide căutarea"
          >
            <Search size={25} />
          </button>
        )}

        {open && (
          <div className="fixed inset-x-0 top-4 z-50 bg-[#dcd0c0] p-6">
            <form onSubmit={handleSearch} className="flex items-center bg-[#dcd0c0] rounded-full border border-[#3a2c27] px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Caută pe Google..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-transparent outline-none text-sm flex-1 text-[#3a2c27] placeholder-[#755c50]"
              />
              
              {/* Buton de căutare */}
              {searchTerm && (
                <button 
                  type="submit"
                  className="ml-2 p-1 hover:scale-110 transition-all duration-200"
                  aria-label="Caută"
                >
                  <Search size={18} />
                </button>
              )}
              
              {/* Buton de închidere */}
              <button 
                type="button"
                onClick={() => {
                  setOpen(false)
                  setSearchTerm('')
                }} 
                className="ml-2 p-1 hover:scale-110 transition-all duration-200"
                aria-label="Închide căutarea"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // Pentru versiunea desktop
  return (
    <div ref={containerRef} className="relative">
      {/* Iconița de căutare */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:scale-110 transition-all duration-200"
          aria-label="Deschide căutarea"
        >
          <Search size={25} />
        </button>
      )}

      {/* Bara de căutare */}
      {open && (
        <form 
          onSubmit={handleSearch}
          className="
             absolute z-50
      sm:top-0 sm:left-0 sm:w-[280px]
      top-full left-0 w-screen px-4
      bg-[#dcd0c0] border border-[#3a2c27] rounded-full
      flex items-center h-10 transform mt-[-1em] sm:translate-y-0
      transition-all duration-300
          "
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Caută pe Google..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-transparent outline-none text-sm w-full text-[#3a2c27] placeholder-[#755c50] pl-3"
          />
          
          {/* Buton de căutare (doar dacă avem text) */}
          {searchTerm && (
            <button 
              type="submit"
              className="mr-1 p-1 hover:scale-110 transition-all duration-200"
              aria-label="Caută"
            >
              <Search size={16} />
            </button>
          )}
          
          {/* Buton de închidere */}
          <button 
            type="button"
            onClick={() => {
              setOpen(false)
              setSearchTerm('')
            }} 
            className="ml-2 mr-2 p-1 hover:scale-110 transition-all duration-200"
            aria-label="Închide căutarea"
          >
            <X size={18} />
          </button>
        </form>
      )}
    </div>
  )
}