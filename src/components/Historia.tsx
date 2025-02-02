"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useAppContext } from "@/contexts/AppContext"
import { useState, useEffect } from "react"

interface HistoriaConfig {
  title: string
  description: string
  imageUrl: string
}

export function Historia() {
  const { theme } = useAppContext()
  const [config, setConfig] = useState<HistoriaConfig>({
    title: "Nuestra Historia",
    description: "La Iglesia Pentecostal Apostólica Las Encinas tiene sus raíces en la comunidad local...",
    imageUrl: "/historia.webp",
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/historia-config")
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error("Error fetching historia config:", error)
      }
    }
    fetchConfig()
  }, [])

  return (
    <section id="historia" className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-gray-100" : "text-primary"}`}>
            {config.title}
          </h2>
          <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{config.description}</p>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div
            className={`overflow-hidden rounded-lg shadow-lg ${theme === "dark" ? "shadow-gray-700" : "shadow-primary"}`}
          >
            <Image
              src={config.imageUrl || "/placeholder.svg"}
              alt="Historia de IPA Las Encinas"
              width={500}
              height={350}
              className="w-full h-auto transition-transform duration-600 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

