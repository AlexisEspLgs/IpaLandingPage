'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, FileText, Calendar } from 'lucide-react'

interface RecentActivity {
  id: number;
  action: string;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalPosts: number;
    recentActivity: RecentActivity[];
  }>({
    totalUsers: 0,
    totalPosts: 0,
    recentActivity: []
  })

  useEffect(() => {
    // Aquí normalmente harías una llamada a la API para obtener las estadísticas reales
    // Por ahora, usaremos datos de ejemplo
    setStats({
      totalUsers: 1234,
      totalPosts: 56,
      recentActivity: [
        { id: 1, action: 'New user registered', date: '2023-06-01' },
        { id: 2, action: 'New blog post published', date: '2023-05-30' },
        { id: 3, action: 'User settings updated', date: '2023-05-29' },
      ]
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.recentActivity.map((activity: RecentActivity) => (
                <li key={activity.id} className="text-sm">
                  {activity.action} - {activity.date}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

