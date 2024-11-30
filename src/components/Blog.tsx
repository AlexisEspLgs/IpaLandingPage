'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { ShareButtons } from './ShareButtons'
import { ImageCarousel } from './ImageCarousel'

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/blog')
      const data = await response.json()
      setBlogPosts(data)
    }

    fetchPosts()
  }, [])

  const openPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsShareMenuOpen(false)
  }

  const closePost = () => {
    setSelectedPost(null)
    setIsShareMenuOpen(false)
  }

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen)
  }

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
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openPost(post)}
                    className="text-primary font-semibold hover:text-secondary transition-colors duration-300"
                  >
                    Leer más
                  </button>
                  <ShareButtons post={post} />
                </div>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-primary">{selectedPost.title}</h2>
                <button
                  onClick={toggleShareMenu}
                  className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors duration-300"
                  aria-label="Compartir artículo"
                >
                  <Share2 size={20} />
                </button>
              </div>
              {isShareMenuOpen && (
                <div className="mb-4">
                  <ShareButtons post={selectedPost} />
                </div>
              )}
              <ImageCarousel images={selectedPost.images} inModal={true} />
              <div
                className="mt-6 text-text overflow-y-auto max-h-[60vh]"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              <div className="flex gap-4 mt-6">
                {selectedPost.hasPDF && selectedPost.pdfUrl && (
                  <a
                    href={selectedPost.pdfUrl}
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
  )
}

