"use client"

import Image from "next/image"
import { useAppContext } from "@/contexts/AppContext"
import { useState, useEffect } from "react"

export function Inicio() {
  const { theme } = useAppContext()
  const [config, setConfig] = useState({
    title: "Bienvenidos a IPA Las Encinas",
    subtitle: "Iglesia Pentecostal Apostólica",
    imageUrl: "/logo.jpg",
    imagePosition: "left",
    imageWidth: 200,
    imageHeight: 200,
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/inicio-config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error("Error fetching inicio config:", error)
      }
    }
    fetchConfig()
  }, [])

  return (
    <section
      id="inicio"
      className={`pt-8 min-h-screen flex items-center ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-r from-primary to-secondary text-white"
      }`}
    >
      <div className="container mx-auto text-center px-4 flex flex-col md:flex-row items-center justify-between">
        <div className={`md:w-1/2 ${config.imagePosition === "right" ? "md:order-1" : ""}`}>
          <Image
            src={config.imageUrl || "/placeholder.svg"}
            alt="IPA Las Encinas Logo"
            width={config.imageWidth}
            height={config.imageHeight}
            className={`mx-auto mb-10 rounded-full border-4 ${
              theme === "dark" ? "border-gray-600" : "border-white"
            } shadow-lg animate-pulse`}
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">{config.title}</h1>
          <p className="text-xl md:text-2xl mb-4 animate-fade-in-up">{config.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <button
              onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-primary hover:bg-secondary hover:text-white"
              }`}
            >
              Contáctanos
            </button>
            <button
              onClick={() => document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" })}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-transparent border-2 border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
                  : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              }`}
            >
              Nuestra Historia
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

