"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import { Home, Save, RefreshCw, FileText, ImageIcon, ArrowLeftRight } from "lucide-react"
import { uploadImage } from "@/lib/uploadImage"

interface InicioConfig {
  title: string
  subtitle: string
  imageUrl: string
  imagePosition: "left" | "right"
  imageWidth: number
  imageHeight: number
}

export default function AdminInicioPage() {
  const [config, setConfig] = useState<InicioConfig>({
    title: "",
    subtitle: "",
    imageUrl: "",
    imagePosition: "left",
    imageWidth: 200,
    imageHeight: 200,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/inicio-config")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        throw new Error("Error al cargar la configuración")
      }
    } catch (error) {
      console.error("Error fetching inicio config:", error)
      setMessageType("error")
      setMessage("Error al cargar la configuración de la sección Inicio")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage("")

    try {
      const imageUrl = await uploadImage(file)
      setConfig((prev) => ({ ...prev, imageUrl }))
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

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/inicio-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
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
            <Home className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Sección Inicio</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Personaliza el contenido de la sección de Inicio
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

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Texto */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden h-full">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contenido de Texto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Título
                </Label>
                <div className="relative">
                  <Input id="title" name="title" value={config.title} onChange={handleInputChange} className="pl-9" />
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-sm font-medium">
                  Subtítulo
                </Label>
                <Textarea id="subtitle" name="subtitle" value={config.subtitle} onChange={handleInputChange} rows={4} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Imagen */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden h-full">
            <div className="h-1 bg-purple-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUpload" className="text-sm font-medium">
                  Subir Nueva Imagen
                </Label>
                <Input
                  id="imageUpload"
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="cursor-pointer"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo imagen...
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <Label className="text-sm font-medium">Vista Previa</Label>
                <div className="relative h-48 w-full overflow-hidden rounded-md border">
                  {config.imageUrl ? (
                    <Image
                      src={config.imageUrl || "/placeholder.svg"}
                      alt="Imagen de Inicio"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label className="text-sm font-medium">Posición de la Imagen</Label>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <Button
                    type="button"
                    variant={config.imagePosition === "left" ? "default" : "outline"}
                    onClick={() => setConfig((prev) => ({ ...prev, imagePosition: "left" }))}
                    className="flex-1"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Izquierda
                  </Button>
                  <Button
                    type="button"
                    variant={config.imagePosition === "right" ? "default" : "outline"}
                    onClick={() => setConfig((prev) => ({ ...prev, imagePosition: "right" }))}
                    className="flex-1"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Derecha
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="imageWidth" className="text-sm font-medium">
                    Ancho de la Imagen
                  </Label>
                  <span className="text-sm font-medium">{config.imageWidth}px</span>
                </div>
                <Slider
                  id="imageWidth"
                  min={100}
                  max={500}
                  step={10}
                  value={[config.imageWidth]}
                  onValueChange={(value) => setConfig((prev) => ({ ...prev, imageWidth: value[0] }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="imageHeight" className="text-sm font-medium">
                    Alto de la Imagen
                  </Label>
                  <span className="text-sm font-medium">{config.imageHeight}px</span>
                </div>
                <Slider
                  id="imageHeight"
                  min={100}
                  max={500}
                  step={10}
                  value={[config.imageHeight]}
                  onValueChange={(value) => setConfig((prev) => ({ ...prev, imageHeight: value[0] }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Botones de acción */}
      <motion.div variants={item} className="flex justify-end space-x-4">
        <Button variant="outline" onClick={fetchConfig} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Recargar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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
      </motion.div>
    </motion.div>
  )
}

