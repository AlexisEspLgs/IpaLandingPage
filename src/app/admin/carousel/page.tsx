'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAppContext } from '@/contexts/AppContext'

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
  const { theme } = useAppContext()

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
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold">Gestión del Carrusel</h1>

      <form onSubmit={handleImageUpload} className="space-y-4">
        <Input
          type="file"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          accept="image/*"
          className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
        />
        <Input
          type="text"
          placeholder="Texto alternativo"
          value={newAlt}
          onChange={(e) => setNewAlt(e.target.value)}
          className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
        />
        <Input
          type="number"
          placeholder="Orden"
          value={newOrder}
          onChange={(e) => setNewOrder(e.target.value)}
          className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
        />
        <Button type="submit" className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Imagen
        </Button>
      </form>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image._id} className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
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
                <Button variant="outline" onClick={() => setEditingImage(image)} className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}>
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
                  <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen del carrusel.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleImageDelete(image._id)} className="bg-red-600 text-white hover:bg-red-700">
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
          <AlertDialogContent className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Imagen</AlertDialogTitle>
            </AlertDialogHeader>
            <form onSubmit={handleImageUpdate} className="space-y-4">
              <Input
                type="text"
                placeholder="Texto alternativo"
                value={editingImage.alt}
                onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
              />
              <Input
                type="number"
                placeholder="Orden"
                value={editingImage.order}
                onChange={(e) => setEditingImage({ ...editingImage, order: parseInt(e.target.value) })}
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setEditingImage(null)} className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}>Cancelar</AlertDialogCancel>
                <AlertDialogAction type="submit" className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>Guardar Cambios</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

