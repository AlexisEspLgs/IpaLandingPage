"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/AppContext"
import { uploadImage } from "@/lib/uploadImage"
import Image from "next/image"

export default function NewBlogPost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [hasPDF] = useState(false)
  const [pdfUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const router = useRouter()
  const { theme } = useAppContext()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("") // Limpiar errores anteriores

    try {
      const imageUrl = await uploadImage(file)
      setImages((prev) => [...prev, imageUrl]) // Usar función de actualización
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Error al subir la imagen. Por favor, inténtalo de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("") // Limpiar errores previos

    // Validación básica
    if (!title.trim() || !content.trim() || !date) {
      setError("El título, contenido y fecha son obligatorios.")
      setIsSubmitting(false)
      return
    }

    if (images.length === 0) {
      setError("Por favor, sube al menos una imagen.")
      setIsSubmitting(false)
      return
    }

    const body = {
      title,
      content,
      images,
      date,
      hasPDF,
      pdfUrl: hasPDF ? pdfUrl : undefined,
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        router.push("/admin/blog")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Error al guardar el post.")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      setError("Ocurrió un error inesperado. Por favor, inténtalo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <h1 className="text-2xl font-bold">Crear Nuevo Post</h1>
      <Card className={theme === "dark" ? "bg-gray-800" : "bg-white"}>
        <CardHeader>
          <CardTitle className={theme === "dark" ? "text-white" : "text-gray-800"}>Detalles del Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Imágenes</Label>
              <Input type="file" id="image" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              {isUploading && <p>Subiendo imagen...</p>}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((url, index) => (
                    <Image
                      key={index}
                      src={url || "/placeholder.svg"}
                      alt={`Imagen ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
            {error && <Alert variant="destructive">{error}</Alert>}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Guardando..." : "Crear Post"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

