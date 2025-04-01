'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/firebase"
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  ImageIcon,
  TextQuote,
  CogIcon,
  BookImageIcon,
  LucideFileVideo,
  Bell,
  Mail,
  FootprintsIcon as FooterIcon,
  X,
  ArrowLeft,
  Star,
  ChevronDown,
  ChevronRight,
  Video,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAppContext } from "@/contexts/AppContext"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

// Definir la estructura del menú con secciones
const menuSections = {
  principal: {
    label: "Principal",
    items: [
      { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
      { icon: Users, label: "Usuarios", href: "/admin/users" },
    ]
  },
  contenido: {
    label: "Contenido",
    items: [
      { icon: CogIcon, label: "Inicio", href: "/admin/inicio" },
      { icon: TextQuote, label: "Historia", href: "/admin/historia" },
      { icon: BookImageIcon, label: "Ipalee", href: "/admin/ipalee" },
      { icon: LucideFileVideo, label: "TikTok", href: "/admin/tiktok" },
      { icon: FileText, label: "Blogs", href: "/admin/blog" },
    ]
  },
  multimedia: {
    label: "Multimedia",
    items: [
      { icon: ImageIcon, label: "Carousel Imagenes", href: "/admin/carousel" },
      { icon: Video, label: "Configurar En Vivo !", href: "/admin/facebook-live" },
    ]
  },
  comunicacion: {
    label: "Comunicación",
    items: [
      { icon: Bell, label: "News Popup", href: "/admin/news-popup" },
      { icon: Star, label: "NewsLetter", href: "/admin/newsletter" },
      { icon: Mail, label: "Suscripciones", href: "/admin/subscriptions" },
    ]
  },
  configuracion: {
    label: "Configuración",
    items: [
      { icon: FooterIcon, label: "Footer", href: "/admin/footer" },
      { icon: Settings, label: "Configuracion", href: "/admin/settings" },
    ]
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const { theme } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin") {
      router.push("/admin")
    }
  }, [user, loading, router, pathname])

  // Cerrar sidebar automáticamente en móvil al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/admin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className={`w-12 h-12 border-4 rounded-full ${theme === "dark" ? "border-purple-500 border-t-transparent" : "border-blue-500 border-t-transparent"}`}
        />
      </motion.div>
    )
  }

  if (!user && pathname !== "/admin") {
    return null
  }

  if (pathname === "/admin") {
    return <>{children}</>
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black z-20"
        />
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={isMobile ? { x: -280 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : { x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`${
              isMobile ? "fixed left-0 top-0 bottom-0 z-30 w-[280px] shadow-xl" : "w-64 relative"
            } ${theme === "dark" ? "bg-gray-800" : "bg-white"} flex flex-col h-full`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Admin Panel
              </h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className={`${theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"}`}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Scrollable menu with sections */}
            <div className="flex-1 overflow-y-auto py-2">
              <nav className="space-y-1">
                {Object.entries(menuSections).map(([sectionKey, section]) => (
                  <div key={sectionKey} className="px-2">
                    <button
                      onClick={() => toggleSection(sectionKey)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{section.label}</span>
                      {expandedSections[sectionKey] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSections[sectionKey] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {section.items.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <div
                                className={`flex items-center px-6 py-2 text-sm font-medium transition-colors duration-200 ${
                                  pathname === item.href
                                    ? theme === "dark"
                                      ? "bg-gray-700 text-white"
                                      : "bg-blue-50 text-blue-700"
                                    : theme === "dark"
                                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <item.icon className={`h-4 w-4 mr-2 ${
                                  pathname === item.href
                                    ? theme === "dark"
                                      ? "text-white"
                                      : "text-blue-700"
                                    : theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`} />
                                <span>{item.label}</span>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-700">
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <div
          className={`p-4 border-b ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {pathname !== "/admin/dashboard" && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`mr-2 ${theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"}`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Dashboard
                  </Button>
                </Link>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden ${theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main
          className={`flex-1 overflow-y-auto ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          {/* Elementos decorativos */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.02, 0.04, 0.02],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${
                theme === "dark" ? "bg-purple-500/20" : "bg-blue-500/10"
              }`}
            />
            <motion.div
              animate={{
                scale: [1, 0.9, 1],
                opacity: [0.01, 0.03, 0.01],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
              className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
                theme === "dark" ? "bg-violet-500/20" : "bg-indigo-500/10"
              }`}
            />
          </div>
        </main>
      </div>
    </div>
  )
}