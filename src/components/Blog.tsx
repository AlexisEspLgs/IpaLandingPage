'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPostType {
  id: number;
  title: string;
  content: string;
  images: string[];
  date: string;
  hasPDF?: boolean; // Indica si el post tiene un archivo PDF asociado.
}

const blogPosts: BlogPostType[] = [
  {
    id: 1,
    title: 'Encuentro Mujeres Apostolicas',
    content:
      `<p>Acompáñanos en el Encuentro de Mujeres Apostólicas, 
      una jornada especial para fortalecer tu fe y disfrutar de la comunión con hermanas en Cristo.
      El evento contará con alabanzas dirigidas por la Pastora Carmen Chávez, 
      una inspiradora predicación de la Pastora Irene, y momentos de adoración, como el cántico "A Tus Pies". 
      Además, habrá un tiempo de ungimiento y una oración final de bendición por parte del Pastor Serafín Cuevas.</p>`,
    images: ['/evento_sabado.jpg'],
    date: '2024-11-16',
    hasPDF: true, // Este post tiene un PDF.
  },
  {
    id: 2,
    title: 'Bautismos Ipa Las Encinas',
    content: `
    <p>
      <strong>
        El significado del bautismo
      </strong>
      El bautismo es una expresión pública de nuestra fe y una declaración de que hemos muerto al pecado y resucitado a una vida nueva con Cristo.
      Tal como nos enseña la Palabra en Romanos 6:4:
      <strong>
        "Fuimos, pues, sepultados con él en la muerte por el bautismo,
        para que como Cristo resucitó de los muertos por la gloria del Padre,
        así también nosotros andemos en vida nueva."
      </strong>
    </p>`,
    images: ['/evento1.1.webp', '/evento1.webp'],
    date: '2024-01-26',
    hasPDF: false, // Este post no tiene un PDF.
  },
  {
    id: 3,
    title: 'Jesus La Verdadera Navidad',
    content: `<p><strong>Jesús: La Verdadera Navidad</strong>
  En esta temporada de Navidad, la iglesia IPA Las Encinas presentó la obra <strong>"Jesús: La Verdadera Navidad"</strong>,
                recordándonos el verdadero significado de esta celebración.
                Más allá de los adornos, los regalos y las luces, la Navidad es un tiempo para reflexionar sobre el nacimiento de nuestro Salvador.
                La obra nos llevó a Belén, donde un humilde pesebre se convirtió en el escenario del mayor acto de amor de la humanidad: Dios enviando a Su Hijo para salvarnos. ¡Que nunca olvidemos que Jesús es el verdadero regalo de la Navidad!
              </p>`,
    images: ['/evento3.webp', '/evento3.1.webp'],
    date: '2023-12-22',
    hasPDF: false, // Este post no tiene un PDF.
  },
  
];

function ImageCarousel({ images, inModal = false }: { images: string[], inModal?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  return (
    <div
      className={`relative ${inModal ? 'w-full h-[50vh]' : 'w-full h-48 sm:h-64 md:h-72 lg:h-80'} bg-gray-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentIndex}
          custom={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={images[currentIndex]}
            alt={`Blog image ${currentIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="bg-gray-100"
          />
        </motion.div>
      </AnimatePresence>
      {isHovered && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);

  const openPost = (post: BlogPostType) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  return (
    <section id="blog" className="py-20 bg-background px-2 sm:px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Últimos Artículos</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageCarousel images={post.images} />
              <div className="p-6">
                <p className="text-sm font-medium text-text-light mb-2">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                </p>
                <h3 className="text-xl font-semibold text-primary mb-2">{post.title}</h3>
                <div className="text-text mb-4" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
                <button
                  onClick={() => openPost(post)}
                  className="text-primary font-semibold hover:text-secondary transition-colors duration-300"
                >
                  Leer más
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
            onClick={closePost}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-primary">{selectedPost.title}</h2>
              <ImageCarousel images={selectedPost.images} inModal={true} />
              <div
                className="mt-6 text-text overflow-y-auto max-h-[60vh]"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              <div className="flex gap-4 mt-6">
                {selectedPost.hasPDF && (
                  <a
                    href="/evento_sabado.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors duration-300"
                  >
                    Descargar PDF
                  </a>
                )}
                <button
                  onClick={closePost}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
