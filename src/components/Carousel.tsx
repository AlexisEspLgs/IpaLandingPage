'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const photos = [
  { id: 1, src: '/encuentromujeres.webp', alt: 'Encuentro de Mujeres' },
  { id: 2, src: '/encuentromujeres.webp', alt: 'Foto 2' },
  { id: 3, src: '/encuentromujeres.webp', alt: 'Foto 3' },
];

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % photos.length;
      }
      return (prevIndex - 1 + photos.length) % photos.length;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section id="fotos" className="py-12 bg-background">
      <div className="container mx-auto mb-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Nuestra Galería</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="relative mb-2 h-64 sm:h-72 md:h-96 flex items-center">
            <button
              className="absolute left-0 mb-2 z-10 bg-white bg-opacity-50 p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-200 transform -translate-x-1/2"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={24} />
            </button>
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
                className="absolute w-full h-full"
              >
                <Image
                  src={photos[currentIndex].src}
                  alt={photos[currentIndex].alt}
                  fill
                  className="object-cover rounded-lg"
                />
              </motion.div>
            </AnimatePresence>
            <button
              className="absolute right-0 z-10 bg-white bg-opacity-50 p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-200 transform translate-x-1/2"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 mt-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <div className="text-center mt-4 mb-4 text-text-light">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      </div>
    </section>
  );
}
