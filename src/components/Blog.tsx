'use client'

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPostType {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
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
    imageUrl: '/ipale2.jpg',
    date: '2023-05-15',
  },
  {
    id: 2,
    title: 'Titulo',
    content: "<h2>Contenido Titulo</h2><p>Parrafo</p>",
    imageUrl: '/ipale.jpg',
    date: '2023-05-08',
  },
  {
    id: 3,
    title: 'Titulo',
    content: "<h2>SUBTITULO</h2><p>PARRAFO</p><ol><li><strong>TITULO PARRAFO</strong></li>PARRAFO</ol></p>",
    imageUrl: '/ipale.jpg',
    date: '2023-05-01',
  },
];

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
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                </p>
                <h3 className="text-xl font-semibold text-primary mb-2">{post.title}</h3>
                <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closePost}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="text-3xl font-bold text-primary mb-4">{selectedPost.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                <time dateTime={selectedPost.date}>{new Date(selectedPost.date).toLocaleDateString()}</time>
              </p>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              <button
                onClick={closePost}
                className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-300"
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