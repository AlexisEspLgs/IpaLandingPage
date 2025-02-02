"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import dynamic from "next/dynamic"
import { Inicio } from "../components/Inicio"
import { Carousel } from "../components/Carousel"
import { Historia } from "../components/Historia"
import { ContactForm } from "../components/ContactForm"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { NewsPopup } from "@/components/NewsPopup"
import { useAppContext } from "@/contexts/AppContext"

// Importación dinámica de componentes pesados
const Ipalee = dynamic(() => import("@/components/Ipalee").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Cargando Ipalee...</p>,
})

const TikTokFeed = dynamic(() => import("@/components/TikTokFeed").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Cargando TikTok Feed...</p>,
})

const Blog = dynamic(() => import("@/components/Blog").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Cargando Blog...</p>,
})

const Location = dynamic(() => import("@/components/Location").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
})

export default function Home() {
  const [activeSection, setActiveSection] = useState("inicio")
  const [mounted, setMounted] = useState(false)
  const navItems = ["inicio", "fotos", "historia", "ubicacion", "ipalee", "tiktok", "contacto"]
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const { theme } = useAppContext()

  useEffect(() => {
    setMounted(true)

    if (mounted) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY
        const sections = navItems.map((item) => item.toLowerCase())
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sectionRefs.current[sections[i]]
          if (section && section.offsetTop <= currentScrollY + 100) {
            setActiveSection(sections[i])
            break
          }
        }
      }

      navItems.forEach((item) => {
        sectionRefs.current[item.toLowerCase()] = document.getElementById(item.toLowerCase())
      })

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [mounted, navItems]) // Added navItems to the dependency array

  const scrollToSection = (sectionId: string) => {
    if (!mounted) return

    const section = sectionRefs.current[sectionId]
    if (section) {
      const yOffset = -64
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Navbar activeSection={activeSection} navItems={navItems} onNavItemClick={scrollToSection} />
      <main className="pt-16 lg:pt-20 md:pt-16">
        <Inicio />
        <Carousel />
        <Historia />
        <Suspense fallback={<div>Cargando Blog...</div>}>
          <Blog />
        </Suspense>
        <Suspense fallback={<div>Cargando mapa...</div>}>
          <Location />
        </Suspense>
        <Suspense fallback={<div>Cargando Ipalee...</div>}>
          <Ipalee />
        </Suspense>
        <Suspense fallback={<div>Cargando TikTok Feed...</div>}>
          <TikTokFeed />
        </Suspense>
        <ContactForm />
        <NewsPopup />
      </main>
      <Footer />
    </div>
  )
}

