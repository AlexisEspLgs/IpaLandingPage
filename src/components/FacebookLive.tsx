"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Video, X, MinusCircle, Clock, RefreshCw, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface FacebookLiveConfig {
  active: boolean
  embedCode: string
  title: string
  description: string
  expiresAt: string | null
}

// Tamaños predefinidos para el popup
const SIZES = {
  SMALL: {
    width: 320,
    height: 180,
  },
  MEDIUM: {
    width: 500,
    height: 281,
  },
}

export default function FacebookLive() {
  const [config, setConfig] = useState<FacebookLiveConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [hasEnded, setHasEnded] = useState(false)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [size, setSize] = useState<"SMALL" | "MEDIUM">("MEDIUM")
  const [isMinimized, setIsMinimized] = useState(false)
  const embedContainerRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    fetchConfig()

    // Configurar intervalo para actualizar cada minuto
    const interval = setInterval(() => {
      checkIfStreamHasEnded()
      // Refrescar la configuración cada 5 minutos
      if (Date.now() % (5 * 60 * 1000) < 60000) {
        fetchConfig()
      }
    }, 60000) // Verificar cada minuto

    return () => clearInterval(interval)
  }, [])

  // Verificar si la transmisión ha finalizado
  const checkIfStreamHasEnded = () => {
    if (!config || !config.expiresAt) return

    const expirationDate = new Date(config.expiresAt)
    const now = new Date()

    if (now >= expirationDate && !hasEnded) {
      console.log("La transmisión ha finalizado")
      setHasEnded(true)
      setEndTime(expirationDate)
    }
  }

  // Efecto para verificar si la transmisión ha finalizado cuando se carga la configuración
  useEffect(() => {
    if (config && config.expiresAt) {
      const expirationDate = new Date(config.expiresAt)
      const now = new Date()

      if (now >= expirationDate) {
        setHasEnded(true)
        setEndTime(expirationDate)
      } else {
        setHasEnded(false)
      }
    }
  }, [config])

  const fetchConfig = async () => {
    try {
      console.log("Fetching Facebook Live config...")
      const response = await fetch("/api/admin/facebook-live")

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }

      const data = await response.json()
      console.log("Facebook Live data received:", data)

      // Verificar si el directo está activo
      if (data.config && data.config.active && data.config.embedCode) {
        console.log("Facebook Live config is active")
        setConfig(data.config)

        // Verificar si ha expirado
        if (data.config.expiresAt) {
          const expirationDate = new Date(data.config.expiresAt)
          const now = new Date()

          if (now >= expirationDate) {
            console.log("La transmisión ha finalizado por fecha de expiración")
            setHasEnded(true)
            setEndTime(expirationDate)
          } else {
            setHasEnded(false)
          }
        }
      } else {
        console.log("Facebook Live is not active or has no embed code")
        setConfig(null)
      }
      setError(null)
    } catch (error) {
      console.error("Error fetching Facebook Live config:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      setConfig(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para refrescar la configuración
  const handleRefresh = () => {
    setIsLoading(true)
    fetchConfig()
  }

  // Función para alternar el tamaño
  const toggleSize = () => {
    setSize(size === "SMALL" ? "MEDIUM" : "SMALL")
  }

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    console.log("Facebook Live component is loading...")
    return null
  }

  // Si no hay configuración o no está visible, no mostrar nada
  if (!config || !isVisible) {
    console.log("Facebook Live component not showing:", {
      hasConfig: !!config,
      isVisible,
    })
    return null
  }

  console.log("Rendering Facebook Live component, hasEnded:", hasEnded)

  // Función para renderizar el código de incrustación de forma segura
  const renderEmbedCode = () => {
    if (!config.embedCode) return null

    // Extraer el src del iframe
    const srcMatch = config.embedCode.match(/src="([^"]+)"/)
    if (!srcMatch || !srcMatch[1]) return config.embedCode

    let src = srcMatch[1]

    // Asegurarse de que los parámetros necesarios estén presentes
    if (!src.includes("autoplay=1")) {
      src += (src.includes("?") ? "&" : "?") + "autoplay=1"
    }

    // No silenciar el video para que se siga escuchando cuando está minimizado
    if (src.includes("mute=1")) {
      src = src.replace("mute=1", "mute=0")
    }

    // Crear un nuevo iframe con los parámetros correctos
    const width = SIZES[size].width
    const height = SIZES[size].height

    const newIframe = `<iframe src="${src}" width="${width}" height="${height}" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`

    return (
      <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: newIframe }} />
    )
  }

  // Formatear la fecha de expiración
  const formatExpirationDate = (date: Date | string | null) => {
    if (!date) return null

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return format(dateObj, "d 'de' MMMM 'de' yyyy, HH:mm")
    } catch (error) {
      console.error("Error formatting date:", error)
      return null
    }
  }

  // Renderizar mensaje de finalización si la transmisión ha terminado
  if (hasEnded) {
    return (
      <motion.div
        drag
        dragListener={false}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header con controles de arrastre */}
        <div
          className="bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 p-3 flex items-center justify-between cursor-move"
         
        >
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-white" />
            <span className="text-white font-medium">TRANSMISIÓN FINALIZADA</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 text-center">
          {config.title && <h3 className="text-lg font-bold mb-2 dark:text-gray-100">{config.title}</h3>}

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Esta transmisión en vivo ha finalizado.</p>
            {endTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Finalizó el {formatExpirationDate(endTime)}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar nuevas transmisiones
            </Button>

            <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm" className="w-full">
              Cerrar
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Versión minimizada (notificación flotante) para transmisión activa
  if (isMinimized) {
    return (
      <motion.div
        drag
        dragListener={false}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="fixed bottom-4 right-4 z-50 flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ width: "180px" }}
      >
        {/* Miniatura del video */}
        <div className="w-12 h-12 bg-black flex items-center justify-center">
          <Video className="h-6 w-6 text-red-500" />
        </div>

        {/* Información */}
        <div className="flex-1 p-2 cursor-move">
          <div className="flex items-center space-x-1 mb-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">EN VIVO</span>
          </div>
          {config.title && <p className="text-xs truncate dark:text-gray-300">{config.title}</p>}
        </div>

        {/* Controles */}
        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            aria-label="Expandir"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
            aria-label="Cerrar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    )
  }

  // Versión expandida para transmisión activa
  return (
    <motion.div
      drag
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{
        width: SIZES[size].width,
        height: SIZES[size].height + 80, // Altura adicional para el header y footer
      }}
    >
      {/* Header con controles de arrastre */}
      <div
        className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 p-2 flex items-center justify-between cursor-move"
      >
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse"></div>
          <span className="text-white font-medium text-sm">EN VIVO</span>
          {config.title && <span className="text-white text-sm truncate max-w-[200px]">{config.title}</span>}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleSize}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            aria-label={size === "SMALL" ? "Tamaño mediano" : "Tamaño pequeño"}
          >
            {size === "SMALL" ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Minimizar"
          >
            <MinusCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reproductor */}
      <div
        ref={embedContainerRef}
        className="bg-black flex items-center justify-center"
        style={{
          height: SIZES[size].height,
        }}
      >
        {renderEmbedCode()}
      </div>

      {/* Footer con información */}
      <div className="p-2 text-center flex items-center justify-between">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
        </div>

        {config.expiresAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400">Finaliza: {formatExpirationDate(config.expiresAt)}</p>
        )}
      </div>
    </motion.div>
  )
}

