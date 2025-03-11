"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, FileText, Settings, ImageIcon, Mail, StarsIcon, Calendar, Info, Home, Menu, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalCarouselImages: number
  recentUsers: { id: string; email: string; lastLogin: string }[]
  totalSubscriptions: number
  recentUsersSubs: { id: string; email: string; createdAt: string }[]
}

export default function AdminDashboardContent() {
  const { theme } = useAppContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCarouselImages: 0,
    recentUsers: [],
    totalSubscriptions: 0,
    recentUsersSubs: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Cerrar el sidebar cuando cambia la ruta en dispositivos móviles
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [pathname])

  // Obtener datos del dashboard
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        setError("Error al cargar las estadísticas del dashboard")
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Links de navegación
  const navLinks = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Usuarios", href: "/admin/users" },
    { icon: FileText, label: "Blog", href: "/admin/blog" },
    { icon: ImageIcon, label: "Carrusel", href: "/admin/carousel" },
    { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
    { icon: Info, label: "Historia", href: "/admin/historia" },
    { icon: Home, label: "Inicio", href: "/admin/inicio" },
    { icon: Calendar, label: "Footer", href: "/admin/footer" },
    { icon: Settings, label: "Configuración", href: "/admin/settings" },
  ]

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const statsData = [
    {
      label: "Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      label: "Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      label: "Carrusel",
      value: stats.totalCarouselImages,
      icon: ImageIcon,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      label: "Subscriptores",
      value: stats.totalSubscriptions,
      icon: StarsIcon,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
    },
  ]

  const quickLinks = [
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Blog",
      href: "/admin/blog",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Carrusel",
      href: "/admin/carousel",
      icon: ImageIcon,
      color: "bg-purple-500",
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      color: "bg-amber-500",
    },
    {
      label: "Configuración",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-500",
    },
    {
      label: "Inicio",
      href: "/admin/inicio",
      icon: Home,
      color: "bg-pink-500",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden mx-4 my-4">
      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button className="p-1 rounded-full hover:bg-gray-800 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0 md:ml-64"}`}
      >
        {/* Barra de navegación superior */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold md:ml-0">Dashboard</h1>
            <div className="w-10"></div> {/* Espaciador para centrar el título */}
          </div>
        </header>

        {/* Contenido del dashboard */}
        <main className="p-4 md:p-6">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 max-w-full">
            <motion.div variants={item}>
              <h1 className="text-2xl md:text-3xl font-bold">Bienvenido al Panel de Administración</h1>
              <p className="text-muted-foreground mt-1">Gestiona tu sitio web desde un solo lugar</p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={item}>
              <h2 className="text-xl font-semibold mb-2">Resumen</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statsData.map((stat, index) => (
                  <Card key={index} className={`p-3 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className="flex flex-col items-center md:items-start md:flex-row md:space-x-3">
                      <div className={`p-2 rounded-full ${stat.color} mb-2 md:mb-0`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Quick Access */}
            <motion.div variants={item}>
              <h2 className="text-xl font-semibold mb-2">Acceso Rápido</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {quickLinks.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Card
                      className={`p-3 h-full hover:shadow-md transition-all duration-200 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"}`}
                    >
                      <div className="flex flex-col items-center text-center h-full justify-center py-1">
                        <div className={`${link.color} text-white p-2 rounded-full mb-2`}>
                          <link.icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">{link.label}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity and Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={item}>
                <Card className={`p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Actividad Reciente</h3>
                    <Link href="#" className="text-xs text-blue-500 hover:underline">
                      Ver todo
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {[{ user: "Admin", action: "publicó un nuevo artículo", time: "Hace 2 horas" }].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className={`p-1.5 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} mt-0.5`}>
                          <Users className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-xs">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className={`p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Tareas Pendientes</h3>
                    <Link href="#" className="text-xs text-blue-500 hover:underline">
                      Ver todo
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {[{ task: "Actualizar contenido de la página de inicio", status: "Pendiente" }].map((task, index) => (
                      <div key={index} className={`p-2 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium">{task.task}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${task.status === "Pendiente" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}