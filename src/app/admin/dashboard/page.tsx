"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, FileText, Image } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalCarouselImages: number
  recentUsers: { id: string; email: string; lastLogin: string }[]
}

export default function AdminDashboard() {
  const { theme } = useAppContext()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCarouselImages: 0,
    recentUsers: [],
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
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imágenes en Carrusel</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCarouselImages}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
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
    </div>
  )
}

