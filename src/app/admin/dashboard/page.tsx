"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  FileText,
  Image,
  StarsIcon,
  ArrowUp,
  ArrowDown,
  Settings,
  Mail,
  Calendar,
  Bell,
  Edit,
  Trash,
  LogIn,
  Send,
  Save,
  Plus,
  RefreshCw,
} from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import Link from "next/link"
import type { FormattedActivity } from "@/types/activity"

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalCarouselImages: number
  recentUsers: { id: string; email: string; lastLogin: string }[]
  totalSubscriptions: number
  recentUsersSubs: { id: string; email: string; createdAt: string }[]
  recentActivities: FormattedActivity[]
}

// Hook de animación de conteo
const useCountUp = (target: number, duration = 2) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    let animationFrameId: number

    const step = () => {
      start += Math.ceil(target / (duration * 60)) // Incremento por cada frame
      if (start >= target) {
        setCount(target)
      } else {
        setCount(start)
        animationFrameId = requestAnimationFrame(step) // Animar hasta llegar al número final
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [target, duration])

  return count
}

// Reemplazar la función getActionIcon con una versión tipada correctamente
// Función para determinar el icono basado en el tipo de acción
const getActionIcon = (actionType: string): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    create: Plus,
    update: Edit,
    delete: Trash,
    login: LogIn,
    logout: LogIn,
    send: Send,
    backup: Save,
    system: RefreshCw,
  }

  return iconMap[actionType] || Settings
}

export default function AdminDashboard() {
  const { theme } = useAppContext()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCarouselImages: 0,
    recentUsers: [],
    totalSubscriptions: 0,
    recentUsersSubs: [],
    recentActivities: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Precalcular los contadores para evitar llamar hooks dentro de callbacks
  const userCount = useCountUp(stats.totalUsers, 2)
  const postCount = useCountUp(stats.totalPosts, 2)
  const imageCount = useCountUp(stats.totalCarouselImages, 2)
  const subscriptionCount = useCountUp(stats.totalSubscriptions, 2)

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

    // Registrar actividad de inicio de sesión si es la primera carga
    const logLoginActivity = async () => {
      try {
        await fetch("/api/admin/activity/log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "system",
            userEmail: "admin@ipalasencinas.com",
            action: "login",
            details: "Acceso al dashboard",
          }),
        })
      } catch (error) {
        console.error("Error al registrar actividad de login:", error)
      }
    }

    logLoginActivity()
  }, [])

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

  // Datos para las tarjetas principales
  const mainStats = [
    {
      title: "Usuarios",
      value: userCount,
      icon: Users,
      change: "+12%",
      trend: "up",
      color: "bg-blue-500",
    },
    {
      title: "Artículos",
      value: postCount,
      icon: FileText,
      change: "+5%",
      trend: "up",
      color: "bg-green-500",
    },
    {
      title: "Imágenes",
      value: imageCount,
      icon: Image,
      change: "-3%",
      trend: "down",
      color: "bg-purple-500",
    },
    {
      title: "Suscriptores",
      value: subscriptionCount,
      icon: StarsIcon,
      change: "+8%",
      trend: "up",
      color: "bg-amber-500",
    },
  ]

  // Enlaces rápidos
  const quickLinks = [
    { icon: Users, label: "Usuarios", href: "/admin/users", color: "bg-blue-500" },
    { icon: FileText, label: "Blog", href: "/admin/blog", color: "bg-green-500" },
    { icon: Image, label: "Carousel", href: "/admin/carousel", color: "bg-purple-500" },
    { icon: Mail, label: "Newsletter", href: "/admin/newsletter", color: "bg-amber-500" },
    { icon: Bell, label: "News Popup", href: "/admin/news-popup", color: "bg-pink-500" },
    { icon: Calendar, label: "Footer", href: "/admin/footer", color: "bg-indigo-500" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full">
      {/* Header con información general */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.h1 variants={item} className="text-3xl font-bold mb-2">
            Bienvenido al Panel de Administración
          </motion.h1>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200">
            Gestiona y monitorea tu sitio web desde un solo lugar
          </motion.p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Estadísticas principales */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mainStats.map((stat, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg">
              <div className={`h-1 ${stat.color}`}></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs font-medium flex items-center ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">vs. mes anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-5 w-5 ${stat.color.replace("bg-", "text-")}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Sección de acceso rápido y actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Acceso rápido */}
          <motion.div variants={item} className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Acceso Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link, index) => (
                    <Link key={index} href={link.href}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className={`p-2 rounded-full ${link.color} mr-3`}>
                          <link.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{link.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actividad reciente y usuarios */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Actividad reciente */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivities && stats.recentActivities.length > 0 ? (
                      stats.recentActivities.map((activity) => {
                        const ActionIcon = getActionIcon(activity.actionType)
                        return (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                              <ActionIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                                {activity.details && (
                                  <span className="text-muted-foreground"> - {activity.details}</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay actividades recientes</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usuarios recientes */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Usuarios Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentUsers.length > 0 ? (
                      stats.recentUsers.map((user) => (
                        <div key={user.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Último acceso: {new Date(user.lastLogin).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay usuarios recientes</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Suscriptores recientes */}
        <motion.div variants={item} className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Suscriptores Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recentUsersSubs && stats.recentUsersSubs.length > 0 ? (
                  stats.recentUsersSubs.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                          <Mail className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{sub.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Suscrito: {new Date(sub.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p className="text-sm text-muted-foreground">No hay suscriptores recientes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

