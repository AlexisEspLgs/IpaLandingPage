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
    <div className={`space-y-8 p-6 ${theme === "dark" ? "text-white bg-gray-800" : "text-gray-800"}`}>
      <h1 className="text-4xl font-semibold">Configuración del Footer</h1>
      <div className="space-y-6">
        {/* Información General */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {["churchName", "address", "phone", "email"].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="block text-sm font-semibold">{field === 'churchName' ? "Nombre de la Iglesia" : field === 'address' ? "Dirección" : field === 'phone' ? "Teléfono" : "Email"}</Label>
                <Input
                  id={field}
                  name={field}
                  value={config[field as keyof FooterConfig]}
                  onChange={handleInputChange}
                  className={`mt-2 p-3 rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-sm focus:ring-2 focus:ring-indigo-400 transition-all ease-in-out`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {["facebookUrl", "instagramUrl", "tiktokUrl"].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="block text-sm font-semibold">{field === 'facebookUrl' ? "URL de Facebook" : field === 'instagramUrl' ? "URL de Instagram" : "URL de TikTok"}</Label>
                <Input
                  id={field}
                  name={field}
                  value={config[field as keyof FooterConfig]}
                  onChange={handleInputChange}
                  className={`mt-2 p-3 rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-sm focus:ring-2 focus:ring-indigo-400 transition-all ease-in-out`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="newsletterTitle" className="block text-sm font-semibold">Título del Newsletter</Label>
              <Input
                id="newsletterTitle"
                name="newsletterTitle"
                value={config.newsletterTitle}
                onChange={handleInputChange}
                className={`mt-2 p-3 rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-sm focus:ring-2 focus:ring-indigo-400 transition-all ease-in-out`}
              />
            </div>
            <div>
              <Label htmlFor="newsletterDescription" className="block text-sm font-semibold">Descripción del Newsletter</Label>
              <Textarea
                id="newsletterDescription"
                name="newsletterDescription"
                value={config.newsletterDescription}
                onChange={handleInputChange}
                rows={3}
                className={`mt-2 p-3 rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-sm focus:ring-2 focus:ring-indigo-400 transition-all ease-in-out`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Copyright */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">Copyright</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="copyrightText" className="block text-sm font-semibold">Texto de Copyright</Label>
              <Input
                id="copyrightText"
                name="copyrightText"
                value={config.copyrightText}
                onChange={handleInputChange}
                className={`mt-2 p-3 rounded-md border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"} shadow-sm focus:ring-2 focus:ring-indigo-400 transition-all ease-in-out`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botón de guardar */}
        <div className="text-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  )
}
