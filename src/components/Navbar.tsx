"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "@/contexts/AppContext"

interface NavbarProps {
  activeSection: string
  navItems: string[]
  onNavItemClick: (sectionId: string) => void
}

export function Navbar({ activeSection, navItems, onNavItemClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAdminLink, setShowAdminLink] = useState(false)
  const { theme } = useAppContext()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const keysPressed: { [key: string]: boolean } = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key] = true

      if (keysPressed["Control"] && keysPressed["Shift"] && e.key === "A") {
        setShowAdminLink(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      delete keysPressed[e.key]
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const handleLogoDoubleClick = () => {
    window.location.href = "/admin"
  }

  // Estilos actualizados para el efecto de espejo con blur
  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
    scrolled
      ? theme === "dark"
        ? "bg-gray-800/80 backdrop-blur-md shadow-lg"
        : "bg-white/80 backdrop-blur-md shadow-lg"
      : theme === "dark"
        ? "bg-transparent"
        : "bg-transparent"
  }`

  const navItemClasses = (isActive: boolean) => `
   px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium
   ${
     isActive
       ? theme === "dark"
         ? "bg-primary/20 text-white backdrop-blur-sm shadow-sm"
         : "bg-primary text-white shadow-sm"
       : theme === "dark"
         ? "text-gray-200 hover:bg-gray-700/50 hover:text-white"
         : "text-gray-700 hover:bg-primary/10 hover:text-primary"
   }
 `

  const mobileNavItemClasses = (isActive: boolean) => `
   block w-full text-left px-4 py-3 rounded-md transition-all duration-300 
   ${
     isActive
       ? theme === "dark"
         ? "bg-primary/20 text-white"
         : "bg-primary text-white"
       : theme === "dark"
         ? "text-gray-200 hover:bg-gray-700/50 hover:text-white"
         : "text-gray-700 hover:bg-primary/10 hover:text-primary"
   }
 `

  const logoContainerClasses = `
   flex items-center space-x-3 transition-all duration-300
   ${scrolled ? "scale-90" : "scale-100"}
 `

  const mobileMenuClasses = `
   md:hidden py-4 px-2 mt-2 rounded-lg transition-all duration-300 space-y-1
   ${
     theme === "dark"
       ? "bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-700/50"
       : "bg-white/90 backdrop-blur-md shadow-lg border border-gray-200/50"
   }
 `

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className={logoContainerClasses}>
            <Link href="/">
              <div className="relative overflow-hidden rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                <Image
                  src="/logo.jpg"
                  alt="IPA Las Encinas Logo"
                  width={40}
                  height={40}
                  className="cursor-pointer hover:scale-110 transition-transform duration-300"
                  onDoubleClick={handleLogoDoubleClick}
                />
              </div>
            </Link>
            <h1
              className={`text-lg md:text-xl font-bold transition-all duration-300 ${
                theme === "dark" ? "text-white" : scrolled ? "text-primary" : "text-gray-800"
              } hidden lg:inline`}
            >
              IPA Las Encinas
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavItemClick(item.toLowerCase())}
                className={navItemClasses(activeSection === item.toLowerCase())}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              theme === "dark" ? "text-white hover:bg-gray-700/50" : "text-gray-700 hover:bg-gray-100/80"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="relative">
            <nav className={mobileMenuClasses}>
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onNavItemClick(item.toLowerCase())
                    setMenuOpen(false)
                  }}
                  className={mobileNavItemClasses(activeSection === item.toLowerCase())}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              {showAdminLink && (
                <Link href="/admin" passHref>
                  <span
                    onClick={() => setMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-md transition-all duration-300 ${
                      theme === "dark"
                        ? "text-gray-200 hover:bg-gray-700/50 hover:text-white"
                        : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                    } cursor-pointer`}
                  >
                    Admin
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

