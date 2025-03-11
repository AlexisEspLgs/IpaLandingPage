"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/ui/alert"
import type { BlogPost } from "@/types/blog"
import { uploadImage } from "@/lib/uploadImage"
import { X, ArrowUp, ArrowDown } from "lucide-react"

interface BlogPostFormProps {
  postId?: string
}

export function BlogPostForm({ postId }: BlogPostFormProps) {
  const [, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [hasPDF, setHasPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (postId) {
      fetchPost(postId)
    }
  }, [postId])

  // Actualizar la función fetchPost para usar la nueva estructura de API
  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }
      const data = await response.json()
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
      setImages(data.images)
      setHasPDF(data.hasPDF)
      setPdfUrl(data.pdfUrl || "")
    } catch (err) {
      console.error("Error fetching post:", err)
      setError("Failed to load post. Please try again.")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      setImages([...images, imageUrl])
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Error al subir la imagen. Por favor, inténtalo de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index > 0) || (direction === "down" && index < images.length - 1)) {
      const newImages = [...images]
      const temp = newImages[index]
      newImages[index] = newImages[index + (direction === "up" ? -1 : 1)]
      newImages[index + (direction === "up" ? -1 : 1)] = temp
      setImages(newImages)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (images.length === 0) {
      setError("Al menos una imagen es requerida")
      setIsSubmitting(false)
      return
    }

    const body: Partial<BlogPost> = {
      id: postId,
      title,
      content,
      images,
      hasPDF,
      pdfUrl: hasPDF ? pdfUrl : undefined,
    }

    try {
      const response = await fetch("/api/blog", {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        router.push("/admin/blog")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Error al guardar el post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      setError("Ocurrió un error inesperado")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/blog") // Redirige a la lista de blogs
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Título
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Contenido
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Imágenes
        </label>
        <div className="mt-2 flex items-center space-x-4">
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="mr-2"
          />
          <Button type="button" disabled={isUploading} className="transition duration-300 ease-in-out hover:scale-105">
            {isUploading ? "Subiendo..." : "Subir Imagen"}
          </Button>
        </div>
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Imagen ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-40 rounded-lg transition-transform duration-300 transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Eliminar imagen</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleMoveImage(index, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Mover imagen arriba</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMoveImage(index, "down")}
                    disabled={index === images.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Mover imagen abajo</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="flex items-center">
          <input type="checkbox" checked={hasPDF} onChange={(e) => setHasPDF(e.target.checked)} className="mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiene PDF</span>
        </label>
      </div>
      {hasPDF && (
        <div>
          <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL del PDF
          </label>
          <Input
            type="text"
            id="pdfUrl"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            required={hasPDF}
            className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition duration-300"
        >
          {isSubmitting ? "Guardando..." : postId ? "Actualizar Post" : "Crear Post"}
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          variant="outline"
          className="w-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white hover:dark:bg-red-700 transition duration-300"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

