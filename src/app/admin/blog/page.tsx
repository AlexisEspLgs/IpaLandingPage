'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { BlogPost } from '@/types/blog'
import { Pencil, Trash2 } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { theme } = useAppContext()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/blog')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      // Asegúrate de que cada post tenga un id
      setPosts(data.map((post: BlogPost) => ({
        ...post,
        id: post._id || post.id // Usa _id si existe, de lo contrario usa id
      })))
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
      } else {
        throw new Error('Failed to delete post')
      }
    } catch (err) {
      console.error('Error deleting post:', err)
      setError('Failed to delete post. Please try again.')
    }
  }

  if (isLoading) return <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Cargando posts...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión del Blog</h1>
        <Link href="/admin/blog/new">
          <Button className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>Nuevo Post</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Creado el: {new Date(post.date).toLocaleDateString()}</p>
              </div>
              <div className="space-x-2">
                <Link href={`/admin/blog/edit/${post._id || post.id}`}>
                  <Button variant="outline" size="sm" className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id!)} className="bg-red-600 text-white hover:bg-red-700">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

