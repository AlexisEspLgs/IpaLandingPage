'use client'

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
}

const blogPosts: BlogPostType[] = [
  {
    id: 1,
    title: 'Titulo Noticia Blog',
    content: `<h2>PruebaContenido</h2>
    <p>PrebaSub Titulo</p>
    <ol>
      <li>prueba texto </li>
    </ol>
    <p>Parrafo.</p>`,
    images: ['/ipale2.jpg', '/ipale.jpg', '/ipale3.jpg'],
    date: '2023-05-15',
  },
  {
    id: 2,
    title: 'Titulo',
    content: "<h2>Contenido Titulo</h2><p>Parrafo</p>",
    images: ['/ipale.jpg', '/ipale2.jpg', '/ipale4.jpg'],
    date: '2023-05-08',
  },
  {
    id: 3,
    title: 'Titulo',
    content: "<h2>SUBTITULO</h2><p>PARRAFO</p><ol><li><strong>TITULO PARRAFO</strong></li>PARRAFO</ol></p>",
    images: ['/ipale.jpg', '/ipale3.jpg', '/ipale5.jpg'],
    date: '2023-05-01',
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
      className={`relative overflow-hidden ${inModal ? 'w-full h-[50vh]' : 'w-full h-48'}`}
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
          className="absolute inset-0"
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
      {isHovered && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
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
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closePost}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">{selectedPost.title}</h2>
              <p className="text-sm text-text-light mb-4">
                <time dateTime={selectedPost.date}>
                  {new Date(selectedPost.date).toLocaleDateString()}
                </time>
              </p>
              <ImageCarousel images={selectedPost.images} inModal={true} />
              <div className="mt-6 text-text" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              <button
                onClick={closePost}
                className="mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}