'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAppContext } from '@/contexts/AppContext'
import { uploadImage } from '@/lib/uploadImage'

export default function NewBlogPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [hasPDF, setHasPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { theme } = useAppContext()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      setImages([...images, imageUrl])
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error al subir la imagen. Por favor, inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (images.length === 0) {
      setError('Al menos una imagen es requerida')
      setIsSubmitting(false)
      return
    }

    const body = {
      title,
      content,
      images,
      hasPDF,
      pdfUrl: hasPDF ? pdfUrl : undefined,
    }

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Error al guardar el post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      setError('Ocurrió un error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-2xl font-bold">Crear Nuevo Post</h1>
      <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>Detalles del Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Contenido</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Imágenes</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
                />
                <Button type="button" disabled={isUploading} className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>
                  {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </div>
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((url, index) => (
                    <img key={index} src={url} alt={`Imagen ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hasPDF"
                checked={hasPDF}
                onCheckedChange={setHasPDF}
              />
              <Label htmlFor="hasPDF" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Tiene PDF</Label>
            </div>
            {hasPDF && (
              <div className="space-y-2">
                <Label htmlFor="pdfUrl" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>URL del PDF</Label>
                <Input
                  id="pdfUrl"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  required={hasPDF}
                  className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}
                />
              </div>
            )}
            {error && <Alert variant="destructive">{error}</Alert>}
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}>
            {isSubmitting ? 'Guardando...' : 'Crear Post'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

