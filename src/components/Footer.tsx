"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa"
import { useAppContext } from "@/contexts/AppContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

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

export function Footer() {
  const { theme } = useAppContext()
  const [config, setConfig] = useState<FooterConfig | null>(null)
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/footer-config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error("Error fetching Footer config:", error)
      }
    }
    fetchConfig()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscriptionStatus("loading")
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setSubscriptionStatus("success")
        setEmail("")
      } else {
        throw new Error("Failed to subscribe")
      }
    } catch (error) {
      console.error("Error subscribing:", error)
      setSubscriptionStatus("error")
    }
  }

  if (!config) return null

  return (
    <footer className={`${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"} py-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección del logo y el nombre */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={theme === "dark" ? "/logo-blanco-1024x364.png" : "/logo.jpg"}
              alt={`Logo ${config.churchName}`}
              width={200}
              height={200}
              className="object-contain mb-4"
            />
            <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-primary"}`}>
              {config.churchName}
            </h2>
          </div>

          {/* Dirección y Contacto */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-secondary" : "text-primary"}`}>
              Contacto
            </h3>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{config.address}</p>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Teléfono: {config.phone}</p>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Email: {config.email}</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-secondary" : "text-primary"}`}>
              {config.newsletterTitle}
            </h3>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {config.newsletterDescription}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`flex-grow ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
              />
              <Button
                type="submit"
                disabled={subscriptionStatus === "loading"}
                className={`${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-primary hover:bg-primary-dark"} text-white`}
              >
                {subscriptionStatus === "loading" ? "Suscribiendo..." : "Suscribirse"}
              </Button>
            </form>
            {subscriptionStatus === "success" && <p className="mt-2 text-green-500">¡Gracias por suscribirte!</p>}
            {subscriptionStatus === "error" && (
              <p className="mt-2 text-red-500">Error al suscribirse. Por favor, intenta de nuevo.</p>
            )}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href={config.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className={`${theme === "dark" ? "text-gray-400 hover:text-secondary" : "text-gray-600 hover:text-primary"} transition-colors`}
          >
            <FaFacebook size={24} />
          </a>
          <a
            href={config.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={`${theme === "dark" ? "text-gray-400 hover:text-secondary" : "text-gray-600 hover:text-primary"} transition-colors`}
          >
            <FaInstagram size={24} />
          </a>
          <a
            href={config.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className={`${theme === "dark" ? "text-gray-400 hover:text-secondary" : "text-gray-600 hover:text-primary"} transition-colors`}
          >
            <FaTiktok size={24} />
          </a>
        </div>

        {/* Derechos reservados */}
        <div className="mt-8 text-center">
          <p className={theme === "dark" ? "text-gray-500" : "text-gray-600"}>{config.copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}

