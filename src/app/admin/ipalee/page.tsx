"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import { Users, Upload, Save, RefreshCw, ImageIcon, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface IpaleeImage {
  id: string
  url: string
  order: number
  _id?: string
}

export default function AdminIpaleePage() {
  const [images, setImages] = useState<IpaleeImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const {} = useAppContext()
  const router = useRouter()

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
      const response = await fetch("/api/admin/ipalee-config", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setImages(data.config?.images || [])
      } else {
        throw new Error("Error al cargar las imágenes")
      }
    } catch (error) {
      console.error("Error fetching ipalee images:", error)
      setMessageType("error")
      setMessage("Error al cargar las imágenes de Ipalee")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage("")

    try {
      const imageUrl = await uploadImage(file)
      const newImage: IpaleeImage = {
        id: Date.now().toString(), // ID temporal
        url: imageUrl,
        order: images.length, // Asignar el siguiente orden
      }
      setImages([...images, newImage])
      setMessageType("success")
      setMessage("Imagen subida correctamente")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setMessageType("error")
      setMessage("Error al subir la imagen. Por favor, inténtalo de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  // Función para ejecutar la eliminación
  const handleDeleteImage = async (image: IpaleeImage) => {
    try {

      setIsDeleting(true)
      setDeletingImageId(image.id)
      setMessage("")

      // Si la imagen tiene un _id (está en la base de datos), eliminarla mediante la API
      if (image.id) {

        const response = await fetch("/api/admin/ipalee-config", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId: image.id }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error del servidor: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Error al eliminar la imagen")
        }

        // Actualizar el estado local eliminando la imagen
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        setMessageType("success")
        setMessage("Imagen eliminada correctamente")

        // Forzar una revalidación para asegurar que los datos estén actualizados
        router.refresh()

        // Recargar las imágenes para asegurarnos de que los cambios se reflejen
        setTimeout(() => {
          fetchImages()
        }, 500)
      } else {
        // Si la imagen no tiene _id, solo eliminarla del estado local
        setImages((prevImages) => prevImages.filter((img) => img.id !== image.id))
        setMessageType("success")
        setMessage("Imagen eliminada del estado local")
      }

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error al eliminar la imagen:", error)
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Error al eliminar la imagen")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsDeleting(false)
      setDeletingImageId(null)
    }
  }

  const handleMoveImage = (id: string, direction: "up" | "down") => {
    const index = images.findIndex((image) => image.id === id)
    if (index === -1) return

    if (direction === "up" && index > 0) {
      const newImages = [...images]
      const temp = newImages[index]
      newImages[index] = newImages[index - 1]
      newImages[index - 1] = temp

      // Actualizar órdenes
      newImages.forEach((image, i) => {
        image.order = i
      })

      setImages(newImages)
    } else if (direction === "down" && index < images.length - 1) {
      const newImages = [...images]
      const temp = newImages[index]
      newImages[index] = newImages[index + 1]
      newImages[index + 1] = temp

      // Actualizar órdenes
      newImages.forEach((image, i) => {
        image.order = i
      })

      setImages(newImages)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/ipalee-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ images }),
      })
      if (response.ok) {
        setMessageType("success")
        setMessage("Configuración guardada con éxito")
        setTimeout(() => setMessage(""), 3000)
        router.refresh()

        // Recargar las imágenes para asegurarnos de que los cambios se reflejen
        setTimeout(() => {
          fetchImages()
        }, 500)
      } else {
        throw new Error("Error al guardar la configuración")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      setMessageType("error")
      setMessage("Error al guardar la configuración. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
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
            <Users className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sección Ipalee</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Administra las imágenes de la sección de jóvenes Ipalee
          </motion.p>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-4 mb-4 ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
              : "bg-red-100 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
          } rounded-lg`}
        >
          <Alert variant={messageType === "success" ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUpload" className="text-sm font-medium">
                  Subir Imagen
                </Label>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                {isUploading && (
                  <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo imagen...
                  </div>
                )}
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={fetchImages} className="w-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar Imágenes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de imágenes */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imágenes de Ipalee ({images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    No hay imágenes en la sección Ipalee
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza subiendo tu primera imagen</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Ipalee ${image.order + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            Orden: {image.order}
                          </span>
                        </div>
                        <div className="flex justify-between gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveImage(image.id, "up")}
                            disabled={image.order === 0 || isDeleting}
                            className="flex-1"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveImage(image.id, "down")}
                            disabled={image.order === images.length - 1 || isDeleting}
                            className="flex-1"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>

                          {/* Cada imagen tiene su propio AlertDialog */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1"
                                disabled={isDeleting && deletingImageId === image.id}
                              >
                                {isDeleting && deletingImageId === image.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleDeleteImage(image)
                                  }}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón para añadir más imágenes */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                  >
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Añadir imagen</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

