"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2 } from "lucide-react"
import type { BlogPost } from "@/types/blog"
import { ShareButtons } from "./ShareButtons"
import { ImageCarousel } from "./ImageCarousel"
import { useAppContext } from "@/contexts/AppContext"

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const { theme } = useAppContext()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        if (response.ok) {
          const data = await response.json()
          setBlogPosts(data)
        } else {
          console.error("Error fetching blog posts:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      }
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
    <section id="blog" className={`py-20 px-2 sm:px-4 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-12 ${theme === "dark" ? "text-gray-100" : "text-primary"}`}>
          Últimos Artículos
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              className={`overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageCarousel images={post.images} />
              <div className="p-6">
                <p className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                </p>
                <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-primary"}`}>
                  {post.title}
                </h3>
                <div
                  className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + "..." }}
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openPost(post)}
                    className={`font-semibold transition-colors duration-300 ${
                      theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-primary hover:text-secondary"
                    }`}
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
              className={`rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100 scrollbar-thumb-gray-600 scrollbar-track-gray-700"
                  : "bg-white text-gray-900 scrollbar-thumb-gray-500 scrollbar-track-gray-300"
              } scrollbar-thin`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === "dark" ? "text-gray-100" : "text-primary"}`}>
                  {selectedPost.title}
                </h2>
                <button
                  onClick={toggleShareMenu}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
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
                className={`mt-6 overflow-y-auto max-h-[60vh] ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
              <div className="flex gap-4 mt-6">
                {selectedPost.hasPDF && selectedPost.pdfUrl && (
                  <a
                    href={selectedPost.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-secondary text-white hover:bg-secondary-dark"
                    }`}
                  >
                    Descargar PDF
                  </a>
                )}
                <button
                  onClick={closePost}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
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

