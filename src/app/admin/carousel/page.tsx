"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Pencil, Trash2, Plus, ImageIcon, Upload, ArrowUp, ArrowDown, RefreshCw } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"

interface CarouselImage {
  _id: string
  url: string
  alt: string
  order: number
}

export default function CarouselManagement() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newAlt, setNewAlt] = useState("")
  const [newOrder, setNewOrder] = useState("")
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { } = useAppContext()

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
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/carousel")
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        setError("Error al cargar las imágenes")
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      setError("Error al cargar las imágenes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage || !newAlt || !newOrder) {
      setError("Todos los campos son obligatorios")
      setTimeout(() => setError(""), 3000)
      return
    }

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", newImage)
    formData.append("alt", newAlt)
    formData.append("order", newOrder)

    try {
      const response = await fetch("/api/carousel", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setSuccess("Imagen subida correctamente")
        setTimeout(() => setSuccess(""), 3000)
        fetchImages()
        setNewImage(null)
        setNewAlt("")
        setNewOrder("")
      } else {
        setError("Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingImage) return

    try {
      const response = await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingImage._id,
          alt: editingImage.alt,
          order: editingImage.order,
        }),
      })

      if (response.ok) {
        setSuccess("Imagen actualizada correctamente")
        setTimeout(() => setSuccess(""), 3000)
        fetchImages()
        setEditingImage(null)
      } else {
        setError("Error al actualizar la imagen")
      }
    } catch (error) {
      console.error("Error updating image:", error)
      setError("Error al actualizar la imagen")
    }
  }

  const handleImageDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/carousel?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        setSuccess("Imagen eliminada correctamente")
        setTimeout(() => setSuccess(""), 3000)
        fetchImages()
      } else {
        setError("Error al eliminar la imagen")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      setError("Error al eliminar la imagen")
    }
  }

  if (isLoading && images.length === 0) {
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
            <ImageIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Gestión del Carrusel</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Administra las imágenes que se muestran en el carrusel de la página principal
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
          {success}
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-800"
        >
          {error}
        </motion.div>
      )}

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de subida de imágenes */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Nueva Imagen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageUpload} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Imagen
                  </label>
                  <Input
                    id="image"
                    type="file"
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  {newImage && (
                    <div className="mt-2 relative h-32 w-full overflow-hidden rounded-md">
                      <Image
                        src={URL.createObjectURL(newImage) || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="alt" className="text-sm font-medium">
                    Texto Alternativo
                  </label>
                  <Input
                    id="alt"
                    type="text"
                    value={newAlt}
                    onChange={(e) => setNewAlt(e.target.value)}
                    placeholder="Descripción de la imagen"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="order" className="text-sm font-medium">
                    Orden
                  </label>
                  <Input
                    id="order"
                    type="number"
                    value={newOrder}
                    onChange={(e) => setNewOrder(e.target.value)}
                    placeholder="Posición en el carrusel"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Subir Imagen
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de imágenes */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Imágenes del Carrusel</CardTitle>
              <Button onClick={fetchImages} variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    No hay imágenes en el carrusel
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza subiendo tu primera imagen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image._id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium truncate">{image.alt}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            Orden: {image.order}
                          </span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingImage(image)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Editar
                          </Button>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen del
                                  carrusel.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleImageDelete(image._id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de edición */}
      {editingImage && (
        <AlertDialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Imagen</AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleImageUpdate} className="space-y-4 py-4">
              <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={editingImage.url || "/placeholder.svg"}
                  alt={editingImage.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-alt" className="text-sm font-medium">
                  Texto Alternativo
                </label>
                <Input
                  id="edit-alt"
                  type="text"
                  value={editingImage.alt}
                  onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-order" className="text-sm font-medium">
                  Orden
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-order"
                    type="number"
                    value={editingImage.order}
                    onChange={(e) => setEditingImage({ ...editingImage, order: Number.parseInt(e.target.value) })}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingImage({ ...editingImage, order: editingImage.order - 1 })}
                    disabled={editingImage.order <= 1}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingImage({ ...editingImage, order: editingImage.order + 1 })}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit">Guardar Cambios</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  )
}

