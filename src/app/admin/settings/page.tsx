"use client"

import { useAppContext } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { Sun, Moon, SettingsIcon, Save, RefreshCw, Globe, Bell, Palette } from "lucide-react"
import { motion } from "framer-motion"

export default function Settings() {
  const {
    siteName,
    setSiteName,
    maintenanceMode,
    setMaintenanceMode,
    emailNotifications,
    setEmailNotifications,
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
  } = useAppContext()

  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = () => {
    setIsSaving(true)

    // Simulamos una operación asíncrona
    setTimeout(() => {
      console.log("Saving settings:", { siteName, maintenanceMode, emailNotifications, theme, primaryColor })
      setMessage("Configuración guardada correctamente")
      setIsSaving(false)

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setMessage(""), 3000)
    }, 1000)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white rounded-lg shadow-lg">
        <div className="px-6 py-8">
          <motion.div variants={item} className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Personaliza la apariencia y el comportamiento de la aplicación
          </motion.p>
        </div>
      </div>

      {/* Mensajes de éxito */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 mb-4 bg-green-100 text-green-700 border border-green-300 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-800"
        >
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Configuración general */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name" className="text-sm font-medium">
                Nombre del Sitio
              </Label>
              <div className="relative">
                <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="pl-9" />
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode" className="text-base font-medium">
                  Modo Mantenimiento
                </Label>
                <p className="text-sm text-muted-foreground">
                  Activa el modo mantenimiento para mostrar una página de En construcción
                </p>
              </div>
              <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Notificaciones por Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones por correo cuando haya nuevas suscripciones
                </p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Configuración de apariencia */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Tema</Label>
                <p className="text-sm text-muted-foreground">Cambia entre modo claro y oscuro</p>
              </div>
              <Button onClick={toggleTheme} variant="outline" className="flex items-center gap-2">
                {theme === "light" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Modo Oscuro</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-base font-medium">
                Color Primario
              </Label>
              <p className="text-sm text-muted-foreground mb-2">Personaliza el color principal de la aplicación</p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: primaryColor }} />
                <div className="flex-1 flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-grow"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notificaciones */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base font-medium">
                  Notificaciones Push
                </Label>
                <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real</p>
              </div>
              <Switch id="push-notifications" checked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-log" className="text-base font-medium">
                  Registro de Actividad
                </Label>
                <p className="text-sm text-muted-foreground">Mantener un registro de todas las acciones realizadas</p>
              </div>
              <Switch id="activity-log" checked={true} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botón de guardar */}
      <motion.div variants={item} className="flex justify-end">
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
              Guardar Configuración
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}

