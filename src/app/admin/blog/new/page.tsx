"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAppContext } from "@/contexts/AppContext"
import { uploadImage } from "@/lib/uploadImage"
import Image from "next/image"
import { motion } from "framer-motion"
import { FileText, Calendar, ImageIcon, Upload, Save, ArrowLeft, RefreshCw, FileUp } from "lucide-react"
import Link from "next/link"

export default function NewBlogPost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [hasPDF, setHasPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const router = useRouter()
  const {  } = useAppContext()

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("") // Limpiar errores anteriores

    try {
      const imageUrl = await uploadImage(file)
      setImages((prev) => [...prev, imageUrl]) // Usar función de actualización
      setSuccess("Imagen subida correctamente")
      setTimeout(() => setSuccess(""), 3000)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("") // Limpiar errores previos
    setSuccess("")

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
        setSuccess("Artículo creado correctamente")
        setTimeout(() => {
          router.push("/admin/blog")
          router.refresh()
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || "Error al guardar el artículo.")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      setError("Ocurrió un error inesperado. Por favor, inténtalo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.div variants={item} className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Crear Nuevo Artículo</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Añade un nuevo artículo al blog
          </motion.p>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 bg-green-100 text-green-700 border border-green-300 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-800"
        >
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-800"
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenido principal */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contenido del Artículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Título
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título del artículo"
                    className="pl-9"
                    required
                  />
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Fecha
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Contenido
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenido del artículo..."
                  rows={12}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel lateral */}
        <motion.div variants={item} className="lg:col-span-1 space-y-6">
          {/* Imágenes */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-purple-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imágenes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUpload" className="text-sm font-medium">
                  Subir Imagen
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  <Button type="button" disabled={isUploading} className="whitespace-nowrap">
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {images.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Imágenes Cargadas ({images.length})</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                            className="w-8 h-8 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">No hay imágenes cargadas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PDF */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                PDF Opcional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hasPDF" className="text-base font-medium">
                    Incluir PDF
                  </Label>
                  <p className="text-sm text-muted-foreground">Adjuntar un PDF al artículo</p>
                </div>
                <Switch id="hasPDF" checked={hasPDF} onCheckedChange={setHasPDF} />
              </div>

              {hasPDF && (
                <div className="space-y-2">
                  <Label htmlFor="pdfUrl" className="text-sm font-medium">
                    URL del PDF
                  </Label>
                  <div className="relative">
                    <Input
                      id="pdfUrl"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://ejemplo.com/archivo.pdf"
                      className="pl-9"
                    />
                    <FileUp className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Artículo
                </>
              )}
            </Button>
            <Link href="/admin/blog">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar y Volver
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

