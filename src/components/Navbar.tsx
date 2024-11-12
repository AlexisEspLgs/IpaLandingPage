import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NavbarProps {
  activeSection: string;
  navItems: string[];
  onNavItemClick: (sectionId: string) => void;
}

export function Navbar({ activeSection, navItems, onNavItemClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary shadow-lg' : 'bg-white md:bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="IPA Las Encinas Logo"
              width={40}
              height={40}
              className="mr-3 rounded-full"
            />
            <h1 className={`text-lg md:text-2xl font-bold ${scrolled ? 'text-white' : 'text-primary'} hidden lg:inline`}>
              IPA Las Encinas
            </h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavItemClick(item.toLowerCase())}
                className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                  activeSection === item.toLowerCase()
                    ? 'bg-secondary text-white'
                    : `${scrolled ? 'text-white' : 'text-primary'} hover:bg-secondary hover:text-white`
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-primary'}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-4 bg-white">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onNavItemClick(item.toLowerCase());
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-300 ${
                  activeSection === item.toLowerCase()
                    ? 'bg-secondary text-white'
                    : 'text-primary hover:bg-secondary hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
