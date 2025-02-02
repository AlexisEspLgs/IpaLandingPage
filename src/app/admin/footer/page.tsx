"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/contexts/AppContext"

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
  const { theme } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/admin/footer-config")
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/footer-config", {
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
      <h1 className="text-3xl font-bold">Configuración del Footer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="churchName">Nombre de la Iglesia</Label>
            <Input
              id="churchName"
              name="churchName"
              value={config.churchName}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={config.address}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={config.phone}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={config.email}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebookUrl">URL de Facebook</Label>
            <Input
              id="facebookUrl"
              name="facebookUrl"
              value={config.facebookUrl}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="instagramUrl">URL de Instagram</Label>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              value={config.instagramUrl}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="tiktokUrl">URL de TikTok</Label>
            <Input
              id="tiktokUrl"
              name="tiktokUrl"
              value={config.tiktokUrl}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newsletterTitle">Título del Newsletter</Label>
            <Input
              id="newsletterTitle"
              name="newsletterTitle"
              value={config.newsletterTitle}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
          <div>
            <Label htmlFor="newsletterDescription">Descripción del Newsletter</Label>
            <Textarea
              id="newsletterDescription"
              name="newsletterDescription"
              value={config.newsletterDescription}
              onChange={handleInputChange}
              rows={3}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Copyright</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="copyrightText">Texto de Copyright</Label>
            <Input
              id="copyrightText"
              name="copyrightText"
              value={config.copyrightText}
              onChange={handleInputChange}
              className={theme === "dark" ? "bg-gray-700 text-white" : ""}
            />
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  )
}

