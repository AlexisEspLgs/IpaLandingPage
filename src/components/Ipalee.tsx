'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const images = [
  { id: 1, src: '/ipale.jpg', alt: 'Ipalee 1' },
  { id: 2, src: '/ipale2.jpg', alt: 'Ipalee 2' },
  { id: 3, src: '/ipale3.jpg', alt: 'Ipalee 3' },
  { id: 4, src: '/ipale4.jpg', alt: 'Ipalee 4' },
  { id: 5, src: '/ipale5.jpg', alt: 'Ipalee 5' },
]

export function Ipalee() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="ipalee" className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg mb-12 text-center shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            <span>Jovenes  </span>
            <span className="text-accent">
              {Array.from("Ipalee").map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="aspect-square overflow-hidden rounded-lg shadow-lg bg-white cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                onClick={() => setSelectedImage(image.src)}
              />
            </motion.div>
          ))}
        </div>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
            >
              <Image
                src={selectedImage}
                alt="Enlarged Ipalee image"
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}