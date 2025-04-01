"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DatePicker from "react-datepicker"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Save, RefreshCw, Video, AlertCircle } from "lucide-react"

// Importar los estilos CSS de react-datepicker
import "react-datepicker/dist/react-datepicker.css"

interface FacebookLiveConfig {
  active: boolean
  embedCode: string
  title: string
  description: string
  expiresAt: string | null
}

export default function AdminFacebookLivePage() {
  const [config, setConfig] = useState<FacebookLiveConfig>({
    active: false,
    embedCode: "",
    title: "",
    description: "",
    expiresAt: null,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [date, setDate] = useState<Date | null>(null)
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

  // Efecto para actualizar expiresAt cuando cambia la fecha
  useEffect(() => {
    if (date) {
      setConfig((prev) => ({
        ...prev,
        expiresAt: date.toISOString(),
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        expiresAt: null,
      }))
    }
  }, [date])

  // Efecto para establecer la fecha cuando se carga la configuración
  useEffect(() => {
    if (config.expiresAt) {
      setDate(new Date(config.expiresAt))
    }
  }, [config.expiresAt])

  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/facebook-live", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Configuración cargada:", data.config)
        setConfig(data.config)
      } else {
        throw new Error("Error al cargar la configuración del directo")
      }
    } catch (error) {
      console.error("Error fetching Facebook Live config:", error)
      setMessageType("error")
      setMessage("Error al cargar la configuración del directo de Facebook")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      // Validar que si está activo, tenga código de incrustación
      if (config.active && !config.embedCode.trim()) {
        setMessageType("error")
        setMessage("El código de incrustación es obligatorio cuando el directo está activo")
        setIsSaving(false)
        return
      }

      const response = await fetch("/api/admin/facebook-live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setMessageType("success")
        setMessage("Configuración guardada con éxito")
        setTimeout(() => setMessage(""), 3000)
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar la configuración")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  // Función para renderizar el código de incrustación de forma segura
  const renderEmbedCode = () => {
    if (!config.embedCode) return null

    return (
      <div
        className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
        dangerouslySetInnerHTML={{ __html: config.embedCode }}
      />
    )
  }

  // Función para personalizar el input del DatePicker
  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value || "Seleccionar fecha y hora"}
    </Button>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 rounded-full border-blue-500 dark:border-blue-400 border-t-transparent"
        />
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.div variants={item} className="flex items-center space-x-3">
            <Video className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Directo de Facebook</h1>
          </motion.div>
          <motion.p variants={item} className="text-red-100 dark:text-red-50 mt-2">
            Configura y gestiona las transmisiones en vivo desde Facebook
          </motion.p>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {message && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert variant={messageType === "success" ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="h-1 bg-red-500 dark:bg-red-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Video className="h-5 w-5" />
                Configuración del Directo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estado del directo */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Estado del directo</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Activa esta opción cuando estés transmitiendo en vivo
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={config.active}
                  onCheckedChange={(checked) => setConfig({ ...config, active: checked })}
                />
              </div>

              {/* Título del directo */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del directo</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Ej: Culto dominical en vivo"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Breve descripción del directo..."
                  className="dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>

              {/* Fecha de caducidad con DatePicker */}
              <div className="space-y-2">
                <Label>Fecha y hora de finalización</Label>
                <div className="flex flex-col space-y-2">
                  <div className="react-datepicker-wrapper dark:text-white">
                    <DatePicker
                      selected={date}
                      onChange={(date: Date | null) => setDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Hora"
                      dateFormat="d 'de' MMMM 'de' yyyy, HH:mm"
                      locale={es as unknown as "es"}
                      placeholderText="Seleccionar fecha y hora"
                      customInput={<CustomInput />}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    El directo se desactivará automáticamente después de esta fecha y hora
                  </p>
                </div>
              </div>

              {/* Código de incrustación */}
              <div className="space-y-2">
                <Label htmlFor="embedCode">Código de incrustación de Facebook</Label>
                <Textarea
                  id="embedCode"
                  value={config.embedCode}
                  onChange={(e) => setConfig({ ...config, embedCode: e.target.value })}
                  placeholder='<iframe src="https://www.facebook.com/plugins/video.php?..." width="500" height="281" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>'
                  className="dark:bg-gray-700 dark:border-gray-600 font-mono text-xs"
                  rows={6}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pega aquí el código de incrustación que proporciona Facebook al compartir el video en vivo
                </p>
              </div>

              {/* Alerta informativa */}
              {config.active && !config.embedCode && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      El código de incrustación es obligatorio para activar el directo.
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Para obtenerlo, ve a tu video en vivo en Facebook, haz clic en Compartir y luego en Insertar.
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de guardar */}
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-700 dark:to-orange-700 dark:hover:from-red-800 dark:hover:to-orange-800"
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
                    Guardar Configuración
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de vista previa */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="h-1 bg-orange-500 dark:bg-orange-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.embedCode ? (
                <>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${config.active ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${config.active ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {config.active ? "EN VIVO" : "INACTIVO"}
                      </span>
                    </div>

                    {config.title && <h3 className="text-lg font-bold mb-1 dark:text-gray-100">{config.title}</h3>}

                    {config.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{config.description}</p>
                    )}

                    {renderEmbedCode()}

                    {config.expiresAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Finaliza: {format(new Date(config.expiresAt), "d 'de' MMMM 'de' yyyy, HH:mm")}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Así se verá el directo en la página principal cuando esté activo.</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Video className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                    No hay código de incrustación
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Añade el código de incrustación de Facebook para ver una vista previa de cómo se mostrará el directo
                    en tu sitio.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

