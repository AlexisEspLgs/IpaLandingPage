"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Instagram,
  ExternalLink,
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IpaleeImage {
  id: string
  url: string
  order: number
  instagramUrl?: string
  _id?: string
}

export default function Ipalee() {
  const [images, setImages] = useState<IpaleeImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [selectedImage, setSelectedImage] = useState<IpaleeImage | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/admin/ipalee-config")
        if (response.ok) {
          const data = await response.json()
          console.log("Datos de Ipalee recibidos:", data)

          // Asegurarnos de que data.config.images existe y es un array
          const imagesData = data.config?.images || []
          setImages(imagesData)
        } else {
          console.error("Error al cargar las imágenes de Ipalee")
        }
      } catch (error) {
        console.error("Error fetching ipalee images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  // Función para manejar los likes
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se abra el lightbox
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Función para abrir el lightbox
  const openLightbox = (image: IpaleeImage) => {
    setSelectedImage(image)
    setLightboxOpen(true)
  }

  // Función para cerrar el lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    setTimeout(() => setSelectedImage(null), 300) // Esperar a que termine la animación
  }

  // Función para navegar a la imagen anterior
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedImage) return

    const sortedImages = [...images].sort((a, b) => a.order - b.order)
    const currentIndex = sortedImages.findIndex((img) => img.id === selectedImage.id)

    if (currentIndex > 0) {
      setSelectedImage(sortedImages[currentIndex - 1])
    } else {
      // Ir al último si estamos en el primero (circular)
      setSelectedImage(sortedImages[sortedImages.length - 1])
    }
  }

  // Función para navegar a la imagen siguiente
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedImage) return

    const sortedImages = [...images].sort((a, b) => a.order - b.order)
    const currentIndex = sortedImages.findIndex((img) => img.id === selectedImage.id)

    if (currentIndex < sortedImages.length - 1) {
      setSelectedImage(sortedImages[currentIndex + 1])
    } else {
      // Ir al primero si estamos en el último (circular)
      setSelectedImage(sortedImages[0])
    }
  }

  // Función para abrir enlace de Instagram
  const openInstagramLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se abra el lightbox
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Animaciones
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 dark:border-pink-400"></div>
      </div>
    )
  }

  // Si no hay imágenes, mostrar un mensaje o retornar null
  if (!images || images.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Sección Ipalee</h2>
        <p className="text-gray-600 dark:text-gray-300">No hay imágenes disponibles en este momento.</p>
      </div>
    )
  }

  // Ordenar las imágenes por el campo order
  const sortedImages = [...images].sort((a, b) => a.order - b.order)

  // Generar nombres aleatorios para los posts
  const usernames = ["ipalee_oficial", "jovenes_ipalee", "ipalee_community", "ipalee_youth", "ipalee_moments"]

  return (
    <>
      <section id="ipalee" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Jóvenes Ipalee</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Conoce a nuestros jóvenes y sus actividades en la comunidad.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
              >
                {/* Header del post */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{usernames[index % usernames.length]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ipalee</p>
                    </div>
                  </div>
                  <button className="text-gray-500 dark:text-gray-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Imagen (clickeable) */}
                <div className="relative aspect-square cursor-pointer" onClick={() => openLightbox(image)}>
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Jóvenes Ipalee"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Acciones */}
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => handleLike(image.id, e)}
                        className={`transition-colors ${likedPosts[image.id] ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        <Heart className={`w-6 h-6 ${likedPosts[image.id] ? "fill-red-500" : ""}`} />
                      </button>
                      <button className="text-gray-700 dark:text-gray-300">
                        <MessageCircle className="w-6 h-6" />
                      </button>
                      <button className="text-gray-700 dark:text-gray-300">
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                    <button className="text-gray-700 dark:text-gray-300">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Likes */}
                  <p className="font-medium text-sm mb-1">{Math.floor(Math.random() * 100) + 10} me gusta</p>

                  {/* Caption */}
                  <div className="text-sm">
                    <span className="font-medium mr-1">{usernames[index % usernames.length]}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Momentos especiales con nuestros jóvenes Ipalee. #ipalee #juventud #comunidad
                    </span>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
                    HACE {Math.floor(Math.random() * 23) + 1} HORAS
                  </p>

                  {/* Botón Ver en Instagram */}
                  {image.instagramUrl && (
                    <Button
                      onClick={(e) => openInstagramLink(image.instagramUrl || "", e)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white"
                      size="sm"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Ver en Instagram
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox para ver imágenes a pantalla completa */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-screen-lg w-[95vw] h-[90vh] p-0 bg-black/90 border-none">
          <DialogTitle className="sr-only">Imagen de Jóvenes Ipalee</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botón para cerrar */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Botón para ir a la imagen anterior */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-40 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Imagen a pantalla completa */}
            {selectedImage && (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt="Jóvenes Ipalee"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />

                {/* Botón Ver en Instagram en el lightbox */}
                {selectedImage.instagramUrl && (
                  <div className="absolute bottom-4 z-40">
                    <Button
                      onClick={(e) => openInstagramLink(selectedImage.instagramUrl || "", e)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Ver en Instagram
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Botón para ir a la imagen siguiente */}
            <button
              onClick={goToNext}
              className="absolute right-4 z-40 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

