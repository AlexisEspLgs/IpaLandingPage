"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "@/contexts/AppContext"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from 'lucide-react'

interface NavbarProps {
  activeSection: string
  navItems: string[]
  onNavItemClick: (sectionId: string) => void
}

export function Navbar({ activeSection, navItems, onNavItemClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAdminLink, setShowAdminLink] = useState(false)
  const { theme, setTheme } = useAppContext()

  // Función para manejar el cambio de tema
  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)
  }

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
  px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer
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
  block w-full text-left px-4 py-3 rounded-md transition-all duration-300 cursor-pointer
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
  flex items-center transition-all duration-300
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
        {/* Layout para escritorio usando grid */}
        <div className="hidden md:grid grid-cols-3 items-center py-4">
          {/* Logo a la izquierda - 1/3 del espacio */}
          <div className={`${logoContainerClasses} col-span-1`}>
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
          </div>

          {/* Menú perfectamente centrado - 1/3 del espacio */}
          <div className="flex justify-center items-center col-span-1">
            <nav className="flex items-center space-x-4 ml-8">
              {navItems.map((item) => (
                <div key={item} className="relative group">
                  <button
                    onClick={() => onNavItemClick(item.toLowerCase())}
                    className={`${navItemClasses(activeSection === item.toLowerCase())} relative z-10`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                  {/* Efecto de hover con animación */}
                  <div className="absolute inset-0 bg-transparent group-hover:animate-bounce-subtle z-0"></div>
                </div>
              ))}
            </nav>
          </div>

          {/* Contenedor derecho para switch - 1/3 del espacio */}
          <div className="flex items-center justify-end space-x-3 col-span-1">
            {/* Theme Toggle Switch */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 dark:border-gray-700/30 shadow-sm">
                <Sun className="h-3.5 w-3.5 text-yellow-500 dark:text-gray-400" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeChange}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                />
                <Moon className="h-3.5 w-3.5 text-gray-400 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout simplificado para móviles */}
        <div className="md:hidden flex items-center py-4">
          {/* Logo a la izquierda */}
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
          </div>
          
          {/* Espacio flexible en el medio */}
          <div className="flex-1"></div>
          
          {/* Solo el botón de menú a la derecha */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg transition-all duration-300 ${
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

        {/* Menú móvil */}
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

              {/* Theme Toggle en menú móvil */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between space-x-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md p-2 rounded-lg border border-white/30 dark:border-gray-700/30 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-yellow-500 dark:text-gray-400" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeChange}
                      className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                    />
                    <Moon className="h-4 w-4 text-gray-400 dark:text-blue-400" />
                  </div>
                  <span className="text-sm">{theme === "dark" ? "Modo oscuro" : "Modo claro"}</span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Añadir estilos CSS para el efecto bounce */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease;
        }
        
        .group:hover .group-hover\\:animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease;
        }
      `}</style>
    </header>
  )
}
