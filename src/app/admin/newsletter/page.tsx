"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Send, RefreshCw, Users, Mail, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { uploadImage } from "@/lib/uploadImage"

interface EmailTemplate {
  _id: string
  name: string
  description: string
  htmlContent: string
  previewImage: string
  editableFields: {
    name: string
    type: string
    label: string
    defaultValue: string
    placeholder?: string
    group?: string
  }[]
}

interface Subscriber {
  _id: string
  email: string
  active: boolean
  createdAt: string
}

// Imagen por defecto para usar como fallback
const DEFAULT_LOGO = "/logo.jpg"

export default function NewsletterPage() {
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({})
  const [previewHtml, setPreviewHtml] = useState("")
  const [activeTab, setActiveTab] = useState("custom")
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Memoizar la función generatePreview para evitar recreaciones innecesarias
  const generatePreview = useCallback(async () => {
    if (!selectedTemplate) return

    try {
      const response = await fetch("/api/admin/email-templates/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate._id,
          values: templateValues,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewHtml(data.html)
      }
    } catch (error) {
      console.error("Error al generar vista previa:", error)
    }
  }, [selectedTemplate, templateValues])

  // Cargar plantillas al montar el componente
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/admin/email-templates")
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
        }
      } catch (error) {
        console.error("Error al cargar plantillas:", error)
      }
    }

    fetchTemplates()
    fetchSubscribers()
  }, [])

  // Función para cargar suscriptores
  const fetchSubscribers = async () => {
    setLoadingSubscribers(true)
    try {
      const response = await fetch("/api/subscriptions")
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error("Error al cargar suscriptores:", error)
    } finally {
      setLoadingSubscribers(false)
    }
  }

  // Inicializar plantillas predeterminadas si no hay ninguna
  useEffect(() => {
    const initializeTemplates = async () => {
      if (templates.length === 0) {
        try {
          await fetch("/api/admin/initialize-templates", {
            method: "POST",
          })
          // Recargar las plantillas después de inicializar
          const response = await fetch("/api/admin/email-templates")
          if (response.ok) {
            const data = await response.json()
            setTemplates(data)
          }
        } catch (error) {
          console.error("Error al inicializar plantillas:", error)
        }
      }
    }

    initializeTemplates()
  }, [templates.length])

  // Actualizar valores de la plantilla cuando se selecciona una nueva
  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: Record<string, string> = {}
      const initialPreviews: Record<string, string> = {}

      selectedTemplate.editableFields.forEach((field) => {
        // Si el campo es de tipo imagen, usar el logo por defecto
        if (field.type === "image" && (!field.defaultValue || field.defaultValue === "")) {
          initialValues[field.name] = DEFAULT_LOGO
          initialPreviews[field.name] = DEFAULT_LOGO
        } else {
          initialValues[field.name] = field.defaultValue
          if (field.type === "image") {
            initialPreviews[field.name] = field.defaultValue
          }
        }
      })

      setTemplateValues(initialValues)
      setImagePreview(initialPreviews)
    }
  }, [selectedTemplate])

  // Generar vista previa HTML cuando cambian los valores de la plantilla
  useEffect(() => {
    if (selectedTemplate && Object.keys(templateValues).length > 0) {
      generatePreview()
    }
  }, [templateValues, selectedTemplate, generatePreview])

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId) || null
    setSelectedTemplate(template)
  }

  const handleTemplateValueChange = (fieldName: string, value: string) => {
    setTemplateValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSwitchChange = (fieldName: string, checked: boolean) => {
    setTemplateValues((prev) => ({
      ...prev,
      [fieldName]: checked.toString(),
    }))
  }

  const handleImageUpload = async (fieldName: string, file: File) => {
    if (!file) return

    try {
      setUploading((prev) => ({ ...prev, [fieldName]: true }))

      // Crear una URL temporal para la vista previa
      const previewUrl = URL.createObjectURL(file)
      setImagePreview((prev) => ({ ...prev, [fieldName]: previewUrl }))

      // Subir la imagen a Cloudinary
      const imageUrl = await uploadImage(file)

      // Actualizar el valor del campo con la URL de Cloudinary
      handleTemplateValueChange(fieldName, imageUrl)

      setUploading((prev) => ({ ...prev, [fieldName]: false }))
    } catch (error) {
      console.error("Error al subir imagen:", error)
      setError("Error al subir la imagen. Inténtalo de nuevo.")
      setUploading((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(fieldName, file)
    }
  }

  const triggerFileInput = (fieldName: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-field", fieldName)
      fileInputRef.current.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = fileInputRef.current?.getAttribute("data-field") || ""
    const file = e.target.files?.[0]
    if (file && fieldName) {
      handleImageUpload(fieldName, file)
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (fieldName: string) => {
    setTemplateValues((prev) => ({
      ...prev,
      [fieldName]: "",
    }))
    setImagePreview((prev) => ({
      ...prev,
      [fieldName]: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess(false)
    setError("")

    try {
      const payload =
        activeTab === "template" && selectedTemplate
          ? {
              subject,
              templateId: selectedTemplate._id,
              templateValues,
            }
          : {
              subject,
              html: htmlContent,
            }

      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Limpiar formulario después de envío exitoso
        if (activeTab === "custom") {
          setSubject("")
          setHtmlContent("")
        }
      } else {
        setError(data.error || "Error al enviar newsletter")
      }
    } catch (error) {
      setError("Error al enviar newsletter")
      console.error("Error:", error)
    } finally {
      setSending(false)
    }
  }

  // Renderizar campo de entrada según el tipo
  const renderField = (field: EmailTemplate["editableFields"][0]) => {
    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              value={templateValues[field.name] || ""}
              placeholder={field.placeholder}
              onChange={(e) => handleTemplateValueChange(field.name, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )
      case "color":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="flex items-center gap-2">
              <Input
                id={field.name}
                type="color"
                value={templateValues[field.name] || "#000000"}
                onChange={(e) => handleTemplateValueChange(field.name, e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={templateValues[field.name] || ""}
                onChange={(e) => handleTemplateValueChange(field.name, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )
      case "boolean":
        return (
          <div className="flex items-center justify-between space-y-0 pt-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Switch
              id={field.name}
              checked={templateValues[field.name] === "true"}
              onCheckedChange={(checked) => handleSwitchChange(field.name, checked)}
            />
          </div>
        )
      case "image":
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="flex flex-col gap-2">
              {imagePreview[field.name] && (
                <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={imagePreview[field.name] || ""}
                    alt={field.label}
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeImage(field.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => triggerFileInput(field.name)}
                  disabled={uploading[field.name]}
                >
                  {uploading[field.name] ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading[field.name] ? "Subiendo..." : "Subir imagen"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTemplateValueChange(field.name, "/logo.jpg")}
                >
                  Logo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTemplateValueChange(field.name, "/logo-blanco-1024x364.png")}
                >
                  Logo Blanco
                </Button>
              </div>
              <Input
                type="text"
                value={templateValues[field.name] || ""}
                onChange={(e) => handleTemplateValueChange(field.name, e.target.value)}
                placeholder="URL de la imagen"
                className="mt-2"
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type="text"
              value={templateValues[field.name] || ""}
              placeholder={field.placeholder}
              onChange={(e) => handleTemplateValueChange(field.name, e.target.value)}
            />
          </div>
        )
    }
  }

  // Agrupar campos por grupo
  const getGroupedFields = () => {
    if (!selectedTemplate) return {}

    const grouped: Record<string, typeof selectedTemplate.editableFields> = {}

    // Primero agrupar los campos
    selectedTemplate.editableFields.forEach((field) => {
      const group = field.group || "General"
      if (!grouped[group]) {
        grouped[group] = []
      }
      grouped[group].push(field)
    })

    return grouped
  }

  const groupedFields = getGroupedFields()
  const groups = Object.keys(groupedFields).sort((a, b) => {
    // Poner "Imágenes" primero
    if (a === "Imágenes" || a === "Imagen") return -1
    if (b === "Imágenes" || b === "Imagen") return 1
    return a.localeCompare(b)
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Enviar Newsletter</h1>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Éxito</AlertTitle>
          <AlertDescription className="text-green-700">
            Newsletter enviado correctamente a todos los suscriptores.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="custom">HTML Personalizado</TabsTrigger>
              <TabsTrigger value="template">Usar Plantilla</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="subject">Asunto del Email</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Asunto del newsletter"
                  required
                  className="mt-1"
                />
              </div>

              <TabsContent value="custom">
                <div className="mb-6">
                  <Label htmlFor="htmlContent">Contenido HTML</Label>
                  <Textarea
                    id="htmlContent"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Ingrese el contenido HTML del newsletter"
                    required
                    className="min-h-[300px] font-mono text-sm mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="template">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <Label htmlFor="template">Seleccionar Plantilla</Label>
                      <Select value={selectedTemplate?._id || ""} onValueChange={handleTemplateChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccione una plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template._id} value={template._id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTemplate && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedTemplate.name}</CardTitle>
                          <CardDescription>{selectedTemplate.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {groups.map((group) => (
                              <div key={group} className="space-y-4">
                                <h3 className="font-medium text-lg">{group}</h3>
                                <div className="space-y-4 pl-1">
                                  {groupedFields[group].map((field) => renderField(field))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Vista Previa</h3>
                    <div className="border rounded-md p-4 h-[600px] overflow-auto bg-white">
                      {previewHtml ? (
                        <iframe
                          srcDoc={previewHtml}
                          title="Vista previa del email"
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Seleccione una plantilla para ver la vista previa
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={sending || subscribers.length === 0}
                  className="flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Newsletter
                    </>
                  )}
                </Button>
                {subscribers.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    No hay suscriptores disponibles para enviar el newsletter.
                  </p>
                )}
              </div>
            </form>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Suscriptores
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchSubscribers}
                  disabled={loadingSubscribers}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Actualizar</span>
                </Button>
              </div>
              <CardDescription>{subscribers.length} suscriptores activos</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {loadingSubscribers ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subscribers.length > 0 ? (
                <ul className="space-y-2">
                  {subscribers.map((subscriber) => (
                    <li key={subscriber._id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">{subscriber.email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay suscriptores</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full" onClick={fetchSubscribers}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar lista
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Input de archivo oculto para subir imágenes */}
      <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />
    </div>
  )
}

