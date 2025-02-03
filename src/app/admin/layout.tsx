"use client"

import { useEffect } from "react"
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
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAppContext } from "@/contexts/AppContext"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const { theme } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin") {
      router.push("/admin")
    }
  }, [user, loading, router, pathname])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push("/admin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
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
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-12 h-12 border-4 rounded-full ${theme === "dark" ? "border-purple-500 border-t-transparent" : "border-blue-500 border-t-transparent"}`}
        />
      </motion.div>
    )
  }

  if (!user && pathname !== "/admin") {
    return null
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Usuarios", href: "/admin/users" },
    { icon: CogIcon, label: "Inicio", href: "/admin/inicio" },
    { icon: TextQuote, label: "Historia", href: "/admin/historia" },
    { icon: BookImageIcon, label: "Ipalee", href: "/admin/ipalee" },
    { icon: LucideFileVideo, label: "TikTok", href: "/admin/tiktok" },
    { icon: FileText, label: "Blogs", href: "/admin/blog" },
    { icon: ImageIcon, label: "Carousel Imagenes", href: "/admin/carousel" },
    { icon: Bell, label: "News Popup", href: "/admin/news-popup" },
    { icon: Mail, label: "Suscripciones", href: "/admin/subscriptions" },
    { icon: FooterIcon, label: "Footer", href: "/admin/footer" },
    { icon: Settings, label: "Configuracion", href: "/admin/settings" },
  ]

  if (pathname === "/admin") {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={`w-full md:w-64 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg relative z-10`}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4"
        >
          <h2 className={`text-2xl font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            Admin Panel
          </h2>
        </motion.div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href}>
                <motion.span
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                    theme === "dark" 
                      ? "text-gray-300 hover:bg-gray-700" 
                      : "text-gray-700 hover:bg-gray-200"
                  } ${
                    pathname === item.href 
                      ? theme === "dark"
                        ? "bg-gray-700 border-r-4 border-purple-500"
                        : "bg-gray-200 border-r-4 border-blue-500"
                      : ""
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-2 transition-transform duration-200 ${
                    pathname === item.href ? "scale-110" : ""
                  }`} />
                  {item.label}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 w-full md:w-64 p-4"
        >
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-[1.02]"
          >
            <motion.div
              className="flex items-center justify-center w-full"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </motion.div>
          </Button>
        </motion.div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex-1 p-8 overflow-y-auto relative ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Elementos decorativos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${
              theme === "dark" ? "bg-purple-500" : "bg-blue-500"
            }`}
          />
          <motion.div
            animate={{
              scale: [1, 0.9, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
              theme === "dark" ? "bg-violet-500" : "bg-indigo-500"
            }`}
          />
        </div>
      </motion.main>
    </motion.div>
  )
}
