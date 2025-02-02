"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable, type DropResult, type DraggableProvided } from "react-beautiful-dnd"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AppContext"
import { uploadImage } from "@/lib/uploadImage"
import { Trash2, MoveUp, MoveDown } from "lucide-react"

interface IpaleeImage {
  id: string
  url: string
  order: number
}

export default function AdminIpaleePage() {
  const [images, setImages] = useState<IpaleeImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { theme } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch("/api/admin/ipalee-config")
      if (response.ok) {
        const data = await response.json()
        setImages(data.images)
      }
      setIsLoading(false)
    }
    fetchImages()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && images.length < 10) {
      try {
        const imageUrl = await uploadImage(file)
        const newImage: IpaleeImage = {
          id: Date.now().toString(),
          url: imageUrl,
          order: images.length,
        }
        setImages([...images, newImage])
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Error al subir la imagen. Por favor, inténtalo de nuevo.")
      }
    } else if (images.length >= 10) {
      alert("Has alcanzado el límite máximo de 10 imágenes.")
    }
  }

  const handleDeleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const handleMoveImage = (id: string, direction: "up" | "down") => {
    const index = images.findIndex((img) => img.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < images.length - 1)) {
      const newImages = [...images]
      const temp = newImages[index]
      newImages[index] = newImages[index + (direction === "up" ? -1 : 1)]
      newImages[index + (direction === "up" ? -1 : 1)] = temp
      setImages(newImages.map((img, i) => ({ ...img, order: i })))
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newImages = Array.from(images)
    const [reorderedItem] = newImages.splice(result.source.index, 1)
    newImages.splice(result.destination.index, 0, reorderedItem)

    setImages(newImages.map((img, i) => ({ ...img, order: i })))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/ipalee-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      })
      if (response.ok) {
        alert("Configuración guardada con éxito")
        router.refresh()
      } else {
        throw new Error("Error al guardar la configuración")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      alert("Error al guardar la configuración. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Cargando imágenes...</div>
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <h1 className="text-3xl font-bold">Editar Sección de Ipalee</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium mb-1">
              Subir Nueva Imagen
            </label>
            <Input
              id="imageUpload"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
              disabled={images.length >= 10}
            />
            {images.length >= 10 && (
              <p className="text-sm text-red-500 mt-1">Has alcanzado el límite máximo de 10 imágenes.</p>
            )}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {images.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center space-x-4 p-2 rounded-lg ${
                            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Ipalee ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                          <div className="flex-grow">{`Imagen ${index + 1}`}</div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMoveImage(image.id, "up")}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMoveImage(image.id, "down")}
                              disabled={index === images.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}

