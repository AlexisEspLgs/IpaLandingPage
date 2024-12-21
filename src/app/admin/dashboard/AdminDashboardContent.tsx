'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, Settings } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'
import { auth } from '@/lib/firebase'

export default function AdminDashboardContent() {
  const [userCount, setUserCount] = useState<number>(0)
  const [blogCount, setBlogCount] = useState<number>(0)
  const [userName, setUserName] = useState<string>('')
  const { siteName, theme } = useAppContext()

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch blog post count from MongoDB
        const blogResponse = await fetch('/api/blog/count')
        if (blogResponse.ok) {
          const blogData = await blogResponse.json()
          setBlogCount(blogData.count)
        } else {
          console.error('Failed to fetch blog post count')
        }

        // Fetch user stats from Firebase
        const statsResponse = await fetch('/api/users/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setUserCount(statsData.totalUsers)
        } else {
          console.error('Failed to fetch user stats')
        }
      } catch (error) {
        console.error('Error fetching counts:', error)
      }
    }

    fetchCounts()

    // Get current user's display name
    const user = auth.currentUser
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || 'Admin')
    }
  }, [])

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Welcome to {siteName}</h1>
      <div className={`bg-gradient-to-r from-purple-400 to-pink-500 text-white p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-opacity-80' : ''}`}>
        <h2 className="text-2xl font-semibold">Hello, {userName}! 👋</h2>
        <p className="mt-2">We're glad to see you here. Have a great day managing your site!</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Total Users</CardTitle>
            <Users className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userCount}</div>
          </CardContent>
        </Card>
        <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Blog Posts</CardTitle>
            <FileText className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blogCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users">
          <Button className={`w-full ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
            <Users className="mr-2 h-4 w-4" /> Manage Users
          </Button>
        </Link>
        <Link href="/admin/blog">
          <Button className={`w-full ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}>
            <FileText className="mr-2 h-4 w-4" /> Manage Blog Posts
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button className={`w-full ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}>
            <Settings className="mr-2 h-4 w-4" /> System Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}

