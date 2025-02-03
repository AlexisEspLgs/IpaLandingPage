"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, FileText, Image, StarsIcon } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion" // Importamos motion de framer-motion

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalCarouselImages: number
  recentUsers: { id: string; email: string; lastLogin: string }[] 
  totalSubscriptions: number
  recentUsersSubs: { id: string; email: string; createdAt: string }[]
}

// Hook de animación de conteo
const useCountUp = (target: number, duration: number = 2) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = () => {
      start += Math.ceil(target / (duration * 60)) // Incremento por cada frame
      if (start >= target) {
        setCount(target)
      } else {
        setCount(start)
        requestAnimationFrame(step) // Animar hasta llegar al número final
      }
    }
    step()
  }, [target, duration])

  return count
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string
  value: number
  icon: React.ComponentType<any>
  colorClass: string
}) => {
  const count = useCountUp(value, 3) // Incremento más suave

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}  // Animación de entrada
      animate={{ opacity: 1, y: 0 }}   // Finaliza en opacidad completa
      transition={{ duration: 0.7 }}    // Duración de la animación
      className="p-4"
    >
      <Card className="border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-6 w-6 text-${colorClass}`} />
        </CardHeader>
        <CardContent>
          <motion.div
            className={`text-4xl font-bold text-${colorClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {count.toLocaleString()}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
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
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }
        const data = await response.json()
        
        console.log("Datos del dashboard:", data); // Verifica los datos recibidos
        setStats(data)
      } catch (err) {
        setError("Error al cargar las estadísticas del dashboard")
        console.error("Error fetching dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return <div className="text-center p-4">Cargando estadísticas...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Dashboard de Administración
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={Users}
          colorClass="blue-500"
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          colorClass="green-500"
        />
        <StatCard
          title="Imágenes en Carrusel"
          value={stats.totalCarouselImages}
          icon={Image}
          colorClass="purple-500"
        />
        <StatCard
          title="Total Suscriptores"
          value={stats.totalSubscriptions}
          icon={StarsIcon}
          colorClass="purple-500"
        />
      </div>

      {/* Aquí modificamos el layout para alinear las tarjetas al lado */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-wrap gap-6"
      >
        <Card className="w-full md:w-1/2 lg:w-1/3"> {/* Ajustamos el tamaño para que sea flexible */}
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.recentUsers.map((user) => (
                <li key={user.id} className="text-sm">
                  {user.email} - Último acceso: {new Date(user.lastLogin).toLocaleString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2 lg:w-1/3"> {/* Ajustamos el tamaño para que sea flexible */}
          <CardHeader>
            <CardTitle>Últimas Subscripciones a la página</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Verificamos si 'recentUsersSubs' tiene un solo usuario o si está vacío */}
              {stats.recentUsersSubs && stats.recentUsersSubs.length > 0 ? (
                stats.recentUsersSubs.map((user) => (
                  <div key={user.id} className="text-sm">
                    <p>Correo Suscriptor: {user.email}</p>
                  </div>
                ))
              ) : (
                <div>No se encontraron subscripciones recientes.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
