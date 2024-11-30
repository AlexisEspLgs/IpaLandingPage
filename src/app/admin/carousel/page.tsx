'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface CarouselImage {
  _id: string
  url: string
  alt: string
  order: number
}

export default function CarouselManagement() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newAlt, setNewAlt] = useState('')
  const [newOrder, setNewOrder] = useState('')
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const response = await fetch('/api/carousel')
    if (response.ok) {
      const data = await response.json()
      setImages(data)
    }
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage || !newAlt || !newOrder) return

    const formData = new FormData()
    formData.append('file', newImage)
    formData.append('alt', newAlt)
    formData.append('order', newOrder)

    const response = await fetch('/api/carousel', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      fetchImages()
      setNewImage(null)
      setNewAlt('')
      setNewOrder('')
    }
  }

  const handleImageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingImage) return

    const response = await fetch('/api/carousel', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingImage._id,
        alt: editingImage.alt,
        order: editingImage.order,
      }),
    })

    if (response.ok) {
      fetchImages()
      setEditingImage(null)
    }
  }

  const handleImageDelete = async (id: string) => {
    const response = await fetch(`/api/carousel?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      fetchImages()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión del Carrusel</h1>

      <form onSubmit={handleImageUpload} className="space-y-4">
        <Input
          type="file"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          accept="image/*"
        />
        <Input
          type="text"
          placeholder="Texto alternativo"
          value={newAlt}
          onChange={(e) => setNewAlt(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Orden"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Imagen
        </Button>
      </form>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image._id}>
            <CardContent className="p-4">
              <div className="relative h-40 mb-4">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="mb-2">Alt: {image.alt}</p>
              <p className="mb-4">Orden: {image.order}</p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingImage(image)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen del carrusel.
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
            </CardContent>
          </Card>
        ))}
      </div>

      {editingImage && (
        <AlertDialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Imagen</AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleImageUpdate} className="space-y-4">
              <Input
                type="text"
                placeholder="Texto alternativo"
                value={editingImage.alt}
                onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Orden"
                value={editingImage.order}
                onChange={(e) => setEditingImage({ ...editingImage, order: parseInt(e.target.value) })}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setEditingImage(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit">Guardar Cambios</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

