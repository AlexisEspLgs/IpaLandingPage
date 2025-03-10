"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useAppContext } from "@/contexts/AppContext"
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
  const { theme } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/admin/inicio-config")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
      setIsLoading(false)
    }
    fetchConfig()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageUrl = await uploadImage(file)
        setConfig((prev) => ({ ...prev, imageUrl }))
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("Error al subir la imagen. Por favor, inténtalo de nuevo.")
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/inicio-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
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
    return <div className="text-center p-4">Cargando configuración...</div>
  }

  return (
    <div className={`space-y-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
      <h1 className="text-3xl font-bold">Editar Sección de Inicio</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título
            </label>
            <Input
              id="title"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium mb-1">
              Subtítulo
            </label>
            <Textarea
              id="subtitle"
              name="subtitle"
              value={config.subtitle}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium mb-1">
              Imagen
            </label>
            <Input
              id="imageUpload"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          {config.imageUrl && (
            <div className="mt-2">
              <Image
                src={config.imageUrl || "/placeholder.svg"}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Posición de la Imagen</label>
            <div className="flex space-x-4">
              <Button
                onClick={() => setConfig((prev) => ({ ...prev, imagePosition: "left" }))}
                variant={config.imagePosition === "left" ? "default" : "outline"}
              >
                Izquierda
              </Button>
              <Button
                onClick={() => setConfig((prev) => ({ ...prev, imagePosition: "right" }))}
                variant={config.imagePosition === "right" ? "default" : "outline"}
              >
                Derecha
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ancho de la Imagen</label>
            <Slider
              min={100}
              max={500}
              step={10}
              value={[config.imageWidth]}
              onValueChange={(value: number[]) => setConfig((prev) => ({ ...prev, imageWidth: value[0] }))}
            />
            <span className="text-sm">{config.imageWidth}px</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alto de la Imagen</label>
            <Slider
              min={100}
              max={500}
              step={10}
              value={[config.imageHeight]}
              onValueChange={(value: number[]) => setConfig((prev) => ({ ...prev, imageHeight: value[0] }))}
            />
            <span className="text-sm">{config.imageHeight}px</span>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}

