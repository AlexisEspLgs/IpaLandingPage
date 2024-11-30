'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { BlogPost } from '@/types/blog'
import { Pencil, Trash2 } from 'lucide-react'

export function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('Error: Post ID is undefined');
      setError('No se pudo eliminar el post: ID no válido');
      return;
    }
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

  if (isLoading) return <div>Cargando posts...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <Card key={post.id || post._id || index} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">Creado el: {new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/blog/edit/${post._id || post.id || ''}`}>
                <Button variant="outline" size="sm">
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
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => post.id ? handleDelete(post.id) : null}>
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
  )
}

