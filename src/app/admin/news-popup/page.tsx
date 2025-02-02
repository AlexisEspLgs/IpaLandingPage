"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/AppContext"

interface NewsPopupConfig {
  showPopup: boolean
  delayTime: number
  title: string
  content: string
  hasPDF: boolean
  pdfId: string
  enableSubscription: boolean
  subscriptionMessage: string
}

// Crear un Server Action para manejar la subida de PDF
async function uploadPDFAction(formData: FormData) {
  
  const file = formData.get("file") as File
  if (!file) return null

  try {
    const response = await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Failed to upload PDF")
    const data = await response.json()
    return data.fileId
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return null
  }
}

export default function AdminNewsPopupPage() {
  const [config, setConfig] = useState<NewsPopupConfig>({
    showPopup: true,
    delayTime: 5000,
    title: "",
    content: "",
    hasPDF: false,
    pdfId: "",
    enableSubscription: false,
    subscriptionMessage: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pdfFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null) // Added error state
  const { theme } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/admin/news-popup-config")
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

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setConfig((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const fileId = await uploadPDFAction(formData)
      if (fileId) {
        setConfig((prev) => ({ ...prev, pdfId: fileId, hasPDF: true }))
      }
    } catch (error) {
      console.error("Error uploading PDF:", error)
      setError("Error al subir el PDF")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let pdfId = config.pdfId
      if (pdfFile) {
        // Si hay un PDF existente, elimínalo primero
        if (config.pdfId) {
          //await deletePDF(config.pdfId)  //Removed this line as deletePDF is not defined in the updated code.  Consider adding it back if needed.
        }
        const formData = new FormData()
        formData.append("file", pdfFile)
        const uploadResponse = await fetch("/api/upload-pdf", {
          method: "POST",
          body: formData,
        })
        if (uploadResponse.ok) {
          const { fileId } = await uploadResponse.json()
          pdfId = fileId
        } else {
          throw new Error("Failed to upload PDF")
        }
      }

      const response = await fetch("/api/admin/news-popup-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, pdfId }),
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
      <h1 className="text-3xl font-bold">Configuración del Popup de Noticias</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showPopup">Mostrar Popup</Label>
            <Switch id="showPopup" checked={config.showPopup} onCheckedChange={handleSwitchChange("showPopup")} />
          </div>
          <div>
            <Label htmlFor="delayTime">Tiempo de retraso (ms)</Label>
            <Input
              id="delayTime"
              name="delayTime"
              type="number"
              value={config.delayTime}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={config.title}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              name="content"
              value={config.content}
              onChange={handleInputChange}
              rows={4}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="hasPDF">Incluir PDF</Label>
            <Switch id="hasPDF" checked={config.hasPDF} onCheckedChange={handleSwitchChange("hasPDF")} />
          </div>
          {config.hasPDF && (
            <div>
              <Label htmlFor="pdfUpload">Subir PDF</Label>
              <Input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                className={theme === "dark" ? "bg-gray-700 text-white" : ""}
              />
              {config.pdfId && (
                <p className="mt-2 text-sm">
                  PDF actual:{" "}
                  <a
                    href={`/api/pdf/${config.pdfId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver PDF
                  </a>
                </p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSubscription">Habilitar Suscripción</Label>
            <Switch
              id="enableSubscription"
              checked={config.enableSubscription}
              onCheckedChange={handleSwitchChange("enableSubscription")}
            />
          </div>
          {config.enableSubscription && (
            <div>
              <Label htmlFor="subscriptionMessage">Mensaje de Suscripción</Label>
              <Textarea
                id="subscriptionMessage"
                name="subscriptionMessage"
                value={config.subscriptionMessage}
                onChange={handleInputChange}
                rows={2}
                className={theme === "dark" ? "bg-gray-700 text-white" : ""}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
    </div>
  )
}

