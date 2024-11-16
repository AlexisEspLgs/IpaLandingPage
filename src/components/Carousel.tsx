'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const photos = [
  { id: 1, src: '/galeria.webp', alt: 'Foto 1' },
  { id: 2, src: '/galeria2.webp', alt: 'Foto 2' },
  { id: 3, src: '/galeria3.webp', alt: 'Foto 3' },
  { id: 4, src: '/galeria4.webp', alt: 'Foto 4' },
  { id: 5, src: '/galeria5.webp', alt: 'Foto 5' },
  { id: 6, src: '/galeria6.webp', alt: 'Foto 6' },
  { id: 7, src: '/galeria7.webp', alt: 'Foto 7' },
  { id: 8, src: '/encuentromujeres.webp', alt: 'Foto 8' },
];

const MAX_WIDTH = '1400px'; // Máximo ancho del carrusel

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const autoAdvance = useCallback(() => {
    if (!isZoomed) {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  }, [isZoomed]);

  useEffect(() => {
    const timer = setInterval(autoAdvance, 5000);
    return () => clearInterval(timer);
  }, [autoAdvance]);

  const paginate = (newDirection: number) => {
    if (!isZoomed) {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        if (newDirection === 1) {
          return (prevIndex + 1) % photos.length;
        }
        return (prevIndex - 1 + photos.length) % photos.length;
      });
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <section id="fotos" className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-primary">
          Nuestra Galería
        </h2>
        <div className="relative mx-auto" style={{ maxWidth: MAX_WIDTH }}>
          <div
            className={`relative mb-2 flex items-center overflow-hidden rounded-lg shadow-lg 
              h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]`}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-300 ease-in-out ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                >
                  <Image
                    src={photos[currentIndex].src}
                    alt={photos[currentIndex].alt}
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1400px"
                    loading={currentIndex === 0 ? 'eager' : 'lazy'}
                    priority={currentIndex === 0}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            <button
              className="absolute left-2 sm:left-4 z-10 bg-white bg-opacity-50 p-1 sm:p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={() => paginate(-1)}
              aria-label="Imagen anterior"
              disabled={isZoomed}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-2 sm:right-4 z-10 bg-white bg-opacity-50 p-1 sm:p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={() => paginate(1)}
              aria-label="Siguiente imagen"
              disabled={isZoomed}
            >
              <ChevronRight size={24} />
            </button>
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-white bg-opacity-50 p-1 sm:p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-200"
              onClick={toggleZoom}
              aria-label={isZoomed ? 'Alejar imagen' : 'Acercar imagen'}
            >
              {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-gray-300 hover:bg-primary-light'
                }`}
                onClick={() => !isZoomed && setCurrentIndex(index)}
                aria-label={`Ir a la imagen ${index + 1}`}
                disabled={isZoomed}
              />
            ))}
          </div>
          <div className="text-center mt-4 text-text-light text-sm sm:text-base">
            <span className="font-semibold">{currentIndex + 1}</span> / {photos.length}
          </div>
        </div>
      </div>
    </section>
  );
}
