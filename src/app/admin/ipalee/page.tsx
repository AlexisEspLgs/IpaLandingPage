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
import { Users, Upload, Save, RefreshCw, ImageIcon, Trash2, Plus, ArrowUp, ArrowDown, Instagram } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface IpaleeImage {
  id: string
  url: string
  order: number
  instagramUrl?: string
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
        console.log("Imágenes cargadas:", data.config?.images)
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
        instagramUrl: "", // Inicialmente vacío
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
      console.log("Ejecutando eliminación para imagen:", image)

      setIsDeleting(true)
      setDeletingImageId(image.id)
      setMessage("")

      // Si la imagen tiene un _id (está en la base de datos), eliminarla mediante la API
      if (image.id) {
        console.log(`Llamando a la API para eliminar imagen con id: ${image.id}`)

        const response = await fetch("/api/admin/ipalee-config", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId: image.id }),
        })

        console.log("Respuesta de la API recibida:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error del servidor: ${response.status}`)
        }

        const data = await response.json()
        console.log("Datos de respuesta:", data)

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
        console.log("La imagen no tiene _id, solo se eliminará del estado local")
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




  // Función para actualizar directamente la URL de Instagram
  const handleInstagramUrlChange = (id: string, value: string) => {
    setImages((prevImages) => prevImages.map((img) => (img.id === id ? { ...img, instagramUrl: value } : img)))
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
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 rounded-full border-blue-500 dark:border-blue-400 border-t-transparent"
        />
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.div variants={item} className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sección Ipalee</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-50 mt-2">
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
              ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
              : "bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
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
          <Card className="border-0 shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="h-1 bg-green-500 dark:bg-green-600"></div>
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
                  className="cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                />
                {isUploading && (
                  <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo imagen...
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Puedes añadir enlaces a Instagram directamente en cada imagen después de subirla.
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-700 dark:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800"
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

              <Button
                variant="outline"
                onClick={fetchImages}
                className="w-full flex items-center justify-center dark:border-gray-600 dark:text-gray-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar Imágenes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de imágenes */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-0 shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="h-1 bg-blue-500 dark:bg-blue-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imágenes de Ipalee ({images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
                    No hay imágenes en la sección Ipalee
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza subiendo tu primera imagen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700 dark:border-gray-600"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Ipalee ${image.order + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Indicador de Instagram */}
                        {image.instagramUrl && (
                          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                            <Instagram className="h-4 w-4 text-pink-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            Orden: {image.order}
                          </span>

                          {/* Indicador de enlace a Instagram */}
                          {image.instagramUrl && (
                            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 rounded-full flex items-center">
                              <Instagram className="h-3 w-3 mr-1" />
                              Enlazado
                            </span>
                          )}
                        </div>

                        {/* Campo para URL de Instagram */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Instagram className="h-3.5 w-3.5 text-pink-500 dark:text-pink-400" />
                            <Label htmlFor={`instagram-${image.id}`} className="text-xs font-medium dark:text-gray-200">
                              URL de Instagram
                            </Label>
                          </div>
                          <Input
                            id={`instagram-${image.id}`}
                            value={image.instagramUrl || ""}
                            onChange={(e) => handleInstagramUrlChange(image.id, e.target.value)}
                            placeholder="https://instagram.com/p/..."
                            className="text-xs h-8 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>

                        {/* Botones de acción */}
                        <div className="grid grid-cols-2 gap-1 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveImage(image.id, "up")}
                            disabled={image.order === 0 || isDeleting}
                            className="flex-1 dark:border-gray-600 dark:text-gray-200"
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Subir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveImage(image.id, "down")}
                            disabled={image.order === images.length - 1 || isDeleting}
                            className="flex-1 dark:border-gray-600 dark:text-gray-200"
                          >
                            <ArrowDown className="h-4 w-4 mr-1" />
                            Bajar
                          </Button>
                        </div>

                        {/* Botón para eliminar */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              disabled={isDeleting && deletingImageId === image.id}
                            >
                              {isDeleting && deletingImageId === image.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="dark:text-gray-100">¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription className="dark:text-gray-300">
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  console.log(`Confirmación de eliminación para imagen: ${image.id}`)
                                  handleDeleteImage(image)
                                }}
                                className="dark:bg-red-700 dark:hover:bg-red-800"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}

                  {/* Botón para añadir más imágenes */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:border-gray-600"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                  >
                    <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Añadir imagen</p>
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

