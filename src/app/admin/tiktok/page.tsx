"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AppContext"
import { Trash2, Edit } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface TikTokVideo {
  id: string
  videoId: string
  thumbnailUrl: string
  title: string
  thumbnailFile?: File | null
}

export default function AdminTikTokPage() {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [newVideo, setNewVideo] = useState({ url: "", title: "", thumbnailFile: null as File | null })
  const [editingVideo, setEditingVideo] = useState<TikTokVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { theme } = useAppContext()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/tiktok-config")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error("Error fetching TikTok videos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === "thumbnailFile" && files) {
      if (editingVideo) {
        setEditingVideo({ ...editingVideo, thumbnailFile: files[0] })
      } else {
        setNewVideo({ ...newVideo, thumbnailFile: files[0] })
      }
    } else if (editingVideo) {
      setEditingVideo({ ...editingVideo, [name]: value })
    } else {
      setNewVideo({ ...newVideo, [name]: value })
    }
  }

  const extractVideoInfo = (url: string) => {
    const videoId = url.split("/").pop()?.split("?")[0]
    return { videoId }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const videoInfo = extractVideoInfo(editingVideo ? editingVideo.videoId : newVideo.url)
      let thumbnailUrl = editingVideo ? editingVideo.thumbnailUrl : ""

      if ((editingVideo && editingVideo.thumbnailFile) || (!editingVideo && newVideo.thumbnailFile)) {
        const file = editingVideo ? editingVideo.thumbnailFile : newVideo.thumbnailFile
        if (file) {
          thumbnailUrl = await uploadImage(file)
        }
      }

      const videoData = editingVideo
        ? { ...editingVideo, ...videoInfo, thumbnailUrl }
        : { id: Date.now().toString(), title: newVideo.title, ...videoInfo, thumbnailUrl }

      const response = await fetch("/api/admin/tiktok-config", {
        method: editingVideo ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      })

      if (response.ok) {
        fetchVideos()
        setNewVideo({ url: "", title: "", thumbnailFile: null })
        setEditingVideo(null)
      } else {
        throw new Error("Failed to save video")
      }
    } catch (error) {
      console.error("Error saving video:", error)
      alert("Error al guardar el video. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tiktok-config?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchVideos()
      } else {
        throw new Error("Failed to delete video")
      }
    } catch (error) {
      console.error("Error deleting video:", error)
      alert("Error al eliminar el video. Por favor, inténtalo de nuevo.")
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Cargando videos de TikTok...</div>
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <h1 className="text-3xl font-bold">Administrar TikTok Feed</h1>
      <Card>
        <CardHeader>
          <CardTitle>{editingVideo ? "Editar Video" : "Agregar Nuevo Video"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              URL del Video de TikTok
            </label>
            <Input
              id="url"
              name="url"
              value={editingVideo ? editingVideo.videoId : newVideo.url}
              onChange={handleInputChange}
              placeholder="https://www.tiktok.com/@username/video/1234567890123456789"
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título del Video
            </label>
            <Input
              id="title"
              name="title"
              value={editingVideo ? editingVideo.title : newVideo.title}
              onChange={handleInputChange}
              placeholder="Título descriptivo del video"
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <label htmlFor="thumbnailFile" className="block text-sm font-medium mb-1">
              Imagen de Miniatura Personalizada
            </label>
            <Input
              id="thumbnailFile"
              name="thumbnailFile"
              type="file"
              onChange={handleInputChange}
              accept="image/*"
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : editingVideo ? "Actualizar Video" : "Agregar Video"}
          </Button>
          {editingVideo && (
            <Button variant="outline" onClick={() => setEditingVideo(null)}>
              Cancelar Edición
            </Button>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4">
              <div className="relative h-40 mb-4">
                <Image
                  src={video.thumbnailUrl || "/placeholder.svg"}
                  alt={video.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingVideo(video)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(video.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

