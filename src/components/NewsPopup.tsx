"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

export function NewsPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [config, setConfig] = useState<NewsPopupConfig | null>(null)
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const { theme } = useAppContext()

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/news-popup-config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
          if (data.showPopup) {
            const timer = setTimeout(() => {
              setShowPopup(true)
            }, data.delayTime)
            return () => clearTimeout(timer)
          }
        }
      } catch (error) {
        console.error("Error fetching NewsPopup config:", error)
      }
    }
    fetchConfig()
  }, [])

  const closePopup = () => {
    setShowPopup(false)
  }

  const handleDownload = () => {
    if (config?.pdfId) {
      window.open(`/api/pdf/${config.pdfId}`, "_blank")
    }
  }

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

  if (!showPopup || !config) return null

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } p-4 md:p-8 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-4xl w-full flex flex-col md:flex-row items-center animate-slide-in`}
      >
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          <Image
            src="/logo.jpg"
            alt="IPA Las Encinas Logo"
            width={120}
            height={120}
            className={`rounded-full border-4 ${theme === "dark" ? "border-blue-400" : "border-primary"} shadow-md`}
          />
        </div>

        <div className="w-full md:w-2/3 text-center md:text-left px-4 md:pl-8">
          <h2
            className={`text-xl md:text-3xl font-bold mb-2 md:mb-4 ${
              theme === "dark" ? "text-blue-400" : "text-primary"
            }`}
          >
            {config.title}
          </h2>
          <p className={`text-sm md:text-lg mb-4 md:mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {config.content}
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {config.hasPDF && (
              <button
                onClick={handleDownload}
                className={`${
                  theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-secondary hover:bg-secondary-dark"
                } text-white px-4 py-2 md:px-6 md:py-3 rounded-md transition-colors duration-300 flex items-center`}
              >
                <Download className="mr-2" size={20} />
                Descargar Información
              </button>
            )}
            <button
              onClick={closePopup}
              className={`${
                theme === "dark" ? "bg-gray-600 hover:bg-gray-700" : "bg-primary hover:bg-primary-dark"
              } text-white px-4 py-2 md:px-6 md:py-3 rounded-md transition-colors duration-300`}
            >
              Cerrar
            </button>
          </div>
          {config.enableSubscription && (
            <form onSubmit={handleSubscribe} className="mt-4">
              <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-blue-300" : "text-primary"}`}>
                {config.subscriptionMessage}
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
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
                  className={`${
                    theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-primary hover:bg-primary-dark"
                  } text-white`}
                >
                  {subscriptionStatus === "loading" ? "Suscribiendo..." : "Suscribirse"}
                </Button>
              </div>
              {subscriptionStatus === "success" && <p className="mt-2 text-green-500">¡Gracias por suscribirte!</p>}
              {subscriptionStatus === "error" && (
                <p className="mt-2 text-red-500">Error al suscribirse. Por favor, intenta de nuevo.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

