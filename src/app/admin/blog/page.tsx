"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { BlogPost } from "@/types/blog"
import { Pencil, Trash2, FileText, Plus, Calendar, Grid, List, RefreshCw } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import Image from "next/image"

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [gridMode, setGridMode] = useState(true) // Por defecto, vista en cuadrícula
  const {} = useAppContext()

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

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/blog")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      setPosts(
        data.map((post: BlogPost) => ({
          ...post,
          id: post._id || post.id,
        })),
      )
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to load posts. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("Failed to delete post. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 rounded-full border-blue-500 border-t-transparent"
        />
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.div variants={item} className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Gestión del Blog</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Administra los artículos y publicaciones del blog
          </motion.p>
        </div>
      </div>

      {/* Barra de acciones */}
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setGridMode(false)}
            variant={!gridMode ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" />
            Lista
          </Button>
          <Button
            onClick={() => setGridMode(true)}
            variant={gridMode ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
          >
            <Grid className="h-4 w-4" />
            Cuadrícula
          </Button>
          <Button onClick={fetchPosts} variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Button>
        </Link>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-800"
        >
          {error}
        </motion.div>
      )}

      {/* Lista de posts */}
      {posts.length === 0 ? (
        <motion.div variants={item} className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No hay artículos publicados</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza creando tu primer artículo</p>
          <Link href="/admin/blog/new">
            <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Artículo
            </Button>
          </Link>
        </motion.div>
      ) : gridMode ? (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="h-1 bg-blue-500"></div>
              <div className="relative h-48">
                <Image src={post.images[0] || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{post.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/admin/blog/edit/${post.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex items-center gap-1">
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post.id!)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Artículos Publicados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative w-full sm:w-32 h-24 shrink-0">
                      <Image
                        src={post.images[0] || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                      </div>
                      <h3 className="text-lg font-semibold mb-1 truncate">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                        {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Pencil className="h-3 w-3" />
                            Editar
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex items-center gap-1">
                              <Trash2 className="h-3 w-3" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(post.id!)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

