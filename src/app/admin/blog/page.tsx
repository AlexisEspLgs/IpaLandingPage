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
  const [gridMode, setGridMode] = useState(false)  // Estado para controlar la vista en cuadrícula o lista
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
      setPosts(data.map((post: BlogPost) => ({
        ...post,
        id: post._id || post.id
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

  if (isLoading) return <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-opacity duration-300 ease-in-out opacity-50`}>Cargando posts...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gradient bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Gestión del Blog</h1>
        <Link href="/admin/blog/new">
          <Button className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300 ease-in-out transform hover:scale-105`}>
            Nuevo Post
          </Button>
        </Link>
      </div>

      {/* Control para cambiar entre vista de lista o cuadrícula */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setGridMode(false)} 
            className={`transition duration-300 ease-in-out ${!gridMode ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
          >
            Lista
          </Button>
          <Button
            onClick={() => setGridMode(true)} 
            className={`transition duration-300 ease-in-out ${gridMode ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
          >
            Cuadrícula
          </Button>
        </div>
      </div>

      {/* Mostrar las publicaciones en la vista seleccionada */}
      <div className={gridMode ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {posts.map(post => (
          <Card key={post.id} className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex flex-col justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gradient bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">{post.title}</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Creado el: {new Date(post.date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2 mt-4">
                <Link href={`/admin/blog/edit/${post._id || post.id}`}>
                  <Button variant="outline" size="sm" className={`border-2 ${theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-800'} hover:border-blue-500 hover:text-blue-500 transition duration-300`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="bg-red-600 text-white hover:bg-red-700 transition duration-300 transform hover:scale-105">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} transition duration-300`}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id!)} className="bg-red-600 text-white hover:bg-red-700 transition duration-300 transform hover:scale-105">
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
