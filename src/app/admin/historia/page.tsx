"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppContext } from "@/contexts/AppContext"
import { uploadImage } from "@/lib/uploadImage"

interface HistoriaConfig {
  title: string
  description: string
  imageUrl: string
}

export default function AdminHistoriaPage() {
  const [config, setConfig] = useState<HistoriaConfig>({
    title: "",
    description: "",
    imageUrl: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { theme } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/admin/historia-config")
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
      const response = await fetch("/api/admin/historia-config", {
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
      <h1 className="text-3xl font-bold">Editar Sección de Historia</h1>
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
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              value={config.description}
              onChange={handleInputChange}
              rows={6}
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
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}

