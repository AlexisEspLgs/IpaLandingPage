"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Video, Save, RefreshCw, Trash2, Plus, ArrowUp, ArrowDown, LinkIcon } from "lucide-react"

interface TikTokVideo {
  id: string
  videoId: string
  thumbnailUrl: string
  title: string
}

export default function AdminTikTokPage() {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [newVideoId, setNewVideoId] = useState("")
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [newThumbnailUrl, setNewThumbnailUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const {  } = useAppContext()
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
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/tiktok-config")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      } else {
        throw new Error("Error al cargar los videos")
      }
    } catch (error) {
      console.error("Error fetching TikTok videos:", error)
      setMessageType("error")
      setMessage("Error al cargar los videos de TikTok")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = () => {
    if (!newVideoId || !newVideoTitle || !newThumbnailUrl) {
      setMessageType("error")
      setMessage("Todos los campos son obligatorios")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const newVideo: TikTokVideo = {
      id: Date.now().toString(), // ID temporal
      videoId: newVideoId,
      thumbnailUrl: newThumbnailUrl,
      title: newVideoTitle,
    }

    setVideos([...videos, newVideo])
    setNewVideoId("")
    setNewVideoTitle("")
    setNewThumbnailUrl("")
    setMessageType("success")
    setMessage("Video añadido correctamente")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id))
    setMessageType("success")
    setMessage("Video eliminado correctamente")
    setTimeout(() => setMessage(""), 3000)
  }

  const handleMoveVideo = (id: string, direction: "up" | "down") => {
    const index = videos.findIndex((video) => video.id === id)
    if (index === -1) return

    if (direction === "up" && index > 0) {
      const newVideos = [...videos]
      const temp = newVideos[index]
      newVideos[index] = newVideos[index - 1]
      newVideos[index - 1] = temp
      setVideos(newVideos)
    } else if (direction === "down" && index < videos.length - 1) {
      const newVideos = [...videos]
      const temp = newVideos[index]
      newVideos[index] = newVideos[index + 1]
      newVideos[index + 1] = temp
      setVideos(newVideos)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/tiktok-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos }),
      })
      if (response.ok) {
        setMessageType("success")
        setMessage("Configuración guardada con éxito")
        setTimeout(() => setMessage(""), 3000)
        router.refresh()
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
            <Video className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sección TikTok</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Administra los videos de TikTok que se muestran en la página
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de añadir video */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoId" className="text-sm font-medium">
                  ID del Video
                </Label>
                <div className="relative">
                  <Input
                    id="videoId"
                    value={newVideoId}
                    onChange={(e) => setNewVideoId(e.target.value)}
                    placeholder="Ej: 7320598347523984"
                    className="pl-9"
                  />
                  <Video className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  El ID del video se encuentra en la URL del video de TikTok
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoTitle" className="text-sm font-medium">
                  Título del Video
                </Label>
                <Input
                  id="videoTitle"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Título descriptivo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-sm font-medium">
                  URL de la Miniatura
                </Label>
                <div className="relative">
                  <Input
                    id="thumbnailUrl"
                    value={newThumbnailUrl}
                    onChange={(e) => setNewThumbnailUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="pl-9"
                  />
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button
                onClick={handleAddVideo}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir Video
              </Button>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

              <Button variant="outline" onClick={fetchVideos} className="w-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar Videos
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de videos */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos de TikTok ({videos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No hay videos de TikTok</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Comienza añadiendo tu primer video</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                          <img
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="font-medium text-lg mb-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">ID: {video.videoId}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveVideo(video.id, "up")}
                              disabled={index === 0}
                              className="flex items-center gap-1"
                            >
                              <ArrowUp className="h-4 w-4" />
                              Subir
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveVideo(video.id, "down")}
                              disabled={index === videos.length - 1}
                              className="flex items-center gap-1"
                            >
                              <ArrowDown className="h-4 w-4" />
                              Bajar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el video.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteVideo(video.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
    </motion.div>
  )
}

