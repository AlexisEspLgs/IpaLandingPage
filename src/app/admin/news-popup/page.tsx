"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import { Bell, Upload, Save, RefreshCw, FileText, Clock, Mail, FileUp } from "lucide-react"

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

export default function AdminNewsPopupPage() {
  const [config, setConfig] = useState<NewsPopupConfig>({
    showPopup: false,
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
  const [isUploading, setIsUploading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
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
      const response = await fetch("/api/admin/news-popup-config")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        throw new Error("Error al cargar la configuración")
      }
    } catch (error) {
      console.error("Error fetching news popup config:", error)
      setMessageType("error")
      setMessage("Error al cargar la configuración del popup de noticias")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPdfFile(file)
  }

  const uploadPdf = async () => {
    if (!pdfFile) return

    setIsUploading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("file", pdfFile)

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setConfig((prev) => ({ ...prev, pdfId: data.fileId, hasPDF: true }))
        setMessageType("success")
        setMessage("PDF subido correctamente")
        setTimeout(() => setMessage(""), 3000)
      } else {
        throw new Error("Error al subir el PDF")
      }
    } catch (error) {
      console.error("Error uploading PDF:", error)
      setMessageType("error")
      setMessage("Error al subir el PDF. Por favor, inténtalo de nuevo.")
    } finally {
      setIsUploading(false)
      setPdfFile(null)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/news-popup-config", {
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
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Popup de Noticias</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Configura el popup de noticias que se muestra a los visitantes
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

      {/* Configuración General */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showPopup" className="text-base font-medium">
                  Mostrar Popup
                </Label>
                <p className="text-sm text-muted-foreground">Activa o desactiva el popup de noticias</p>
              </div>
              <Switch
                id="showPopup"
                checked={config.showPopup}
                onCheckedChange={(checked) => handleSwitchChange("showPopup", checked)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="delayTime" className="text-sm font-medium">
                  Tiempo de Retraso (ms)
                </Label>
                <span className="text-sm font-medium">{config.delayTime} ms</span>
              </div>
              <div className="relative">
                <Input
                  id="delayTime"
                  name="delayTime"
                  type="number"
                  value={config.delayTime}
                  onChange={handleInputChange}
                  min={0}
                  step={500}
                  className="pl-9"
                />
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Tiempo en milisegundos antes de mostrar el popup (1000ms = 1 segundo)
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenido */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenido
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
              <Label htmlFor="content" className="text-sm font-medium">
                Contenido
              </Label>
              <Textarea id="content" name="content" value={config.content} onChange={handleInputChange} rows={4} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PDF */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasPDF" className="text-base font-medium">
                  Incluir PDF
                </Label>
                <p className="text-sm text-muted-foreground">Permite a los usuarios descargar un PDF informativo</p>
              </div>
              <Switch
                id="hasPDF"
                checked={config.hasPDF}
                onCheckedChange={(checked) => handleSwitchChange("hasPDF", checked)}
              />
            </div>

            {config.hasPDF && (
              <div className="space-y-2">
                <Label htmlFor="pdfUpload" className="text-sm font-medium">
                  Subir PDF
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pdfUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button onClick={uploadPdf} disabled={!pdfFile || isUploading} className="whitespace-nowrap">
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir
                      </>
                    )}
                  </Button>
                </div>
                {config.pdfId && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    PDF cargado correctamente (ID: {config.pdfId.substring(0, 8)}...)
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Suscripción */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-green-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableSubscription" className="text-base font-medium">
                  Habilitar Suscripción
                </Label>
                <p className="text-sm text-muted-foreground">Muestra un formulario de suscripción en el popup</p>
              </div>
              <Switch
                id="enableSubscription"
                checked={config.enableSubscription}
                onCheckedChange={(checked) => handleSwitchChange("enableSubscription", checked)}
              />
            </div>

            {config.enableSubscription && (
              <div className="space-y-2">
                <Label htmlFor="subscriptionMessage" className="text-sm font-medium">
                  Mensaje de Suscripción
                </Label>
                <div className="relative">
                  <Input
                    id="subscriptionMessage"
                    name="subscriptionMessage"
                    value={config.subscriptionMessage}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

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

