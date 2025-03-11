"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppContext } from "@/contexts/AppContext"
import { motion } from "framer-motion"
import {
  FootprintsIcon,
  Facebook,
  Instagram,
  TwitterIcon as TikTok,
  Mail,
  Building,
  Phone,
  Save,
  RefreshCw,
} from "lucide-react"

interface FooterConfig {
  churchName: string
  address: string
  phone: string
  email: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  newsletterTitle: string
  newsletterDescription: string
  copyrightText: string
}

export default function AdminFooterPage() {
  const [config, setConfig] = useState<FooterConfig>({
    churchName: "",
    address: "",
    phone: "",
    email: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    newsletterTitle: "",
    newsletterDescription: "",
    copyrightText: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const { } = useAppContext()
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
      const response = await fetch("/api/admin/footer-config")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        throw new Error("Error al cargar la configuración")
      }
    } catch (error) {
      console.error("Error fetching footer config:", error)
      setMessageType("error")
      setMessage("Error al cargar la configuración del footer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/footer-config", {
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
            <FootprintsIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Configuración del Footer</h1>
          </motion.div>
          <motion.p variants={item} className="text-blue-100 dark:text-blue-200 mt-2">
            Personaliza la información que aparece en el pie de página
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

      {/* Información General */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="churchName" className="text-sm font-medium">
                Nombre de la Iglesia
              </Label>
              <div className="relative">
                <Input
                  id="churchName"
                  name="churchName"
                  value={config.churchName}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Dirección
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  name="address"
                  value={config.address}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <FootprintsIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <div className="relative">
                <Input id="phone" name="phone" value={config.phone} onChange={handleInputChange} className="pl-9" />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Input id="email" name="email" value={config.email} onChange={handleInputChange} className="pl-9" />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Redes Sociales */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-purple-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Facebook className="h-5 w-5" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="text-sm font-medium">
                URL de Facebook
              </Label>
              <div className="relative">
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  value={config.facebookUrl}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="text-sm font-medium">
                URL de Instagram
              </Label>
              <div className="relative">
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  value={config.instagramUrl}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl" className="text-sm font-medium">
                URL de TikTok
              </Label>
              <div className="relative">
                <Input
                  id="tiktokUrl"
                  name="tiktokUrl"
                  value={config.tiktokUrl}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <TikTok className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Newsletter */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-green-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsletterTitle" className="text-sm font-medium">
                Título del Newsletter
              </Label>
              <div className="relative">
                <Input
                  id="newsletterTitle"
                  name="newsletterTitle"
                  value={config.newsletterTitle}
                  onChange={handleInputChange}
                  className="pl-9"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletterDescription" className="text-sm font-medium">
                Descripción del Newsletter
              </Label>
              <Textarea
                id="newsletterDescription"
                name="newsletterDescription"
                value={config.newsletterDescription}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Copyright */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Copyright</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="copyrightText" className="text-sm font-medium">
                Texto de Copyright
              </Label>
              <Input
                id="copyrightText"
                name="copyrightText"
                value={config.copyrightText}
                onChange={handleInputChange}
              />
            </div>
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

