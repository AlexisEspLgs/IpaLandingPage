'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/lib/firebase'
import { Home, Users, FileText, Settings, LogOut , ImageIcon} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [user, loading, router, pathname])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push('/admin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user && pathname !== '/admin') {
    return null
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: FileText, label: 'Blog Posts', href: '/admin/blog' },
    { icon: ImageIcon, label: 'Carousel', href:'/admin/carousel'},
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                pathname === item.href ? 'bg-gray-200' : ''
              }`}>
                <item.icon className="w-5 h-5 mr-2" />
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

