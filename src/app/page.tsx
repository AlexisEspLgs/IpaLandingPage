'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Inicio } from '../components/Inicio'
import { Carousel } from '../components/Carousel'
import { Historia } from '../components/Historia'
import { Ipalee } from '../components/Ipalee'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { TikTokFeed } from '@/components/TikTokFeed'
import { NewsPopup } from '@/components/NewsPopup'
import Blog from '@/components/Blog'

// Importación dinámica del nuevo componente de mapa
const Location = dynamic(() => import('@/components/Location'), { 
  ssr: false,
  loading: () => <p>Cargando mapa...</p>
})

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [mounted, setMounted] = useState(false)
  const navItems = ['inicio', 'fotos', 'historia', 'ubicacion', 'ipalee', 'tiktok', 'contacto']
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    setMounted(true)

    if (mounted) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY
        const sections = navItems.map(item => item.toLowerCase())
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sectionRefs.current[sections[i]]
          if (section && section.offsetTop <= currentScrollY + 100) {
            setActiveSection(sections[i])
            break
          }
        }
      }

      navItems.forEach(item => {
        sectionRefs.current[item.toLowerCase()] = document.getElementById(item.toLowerCase())
      })

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [mounted, navItems])

  const scrollToSection = (sectionId: string) => {
    if (!mounted) return

    const section = sectionRefs.current[sectionId]
    if (section) {
      const yOffset = -64
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar 
        activeSection={activeSection} 
        navItems={navItems} 
        onNavItemClick={scrollToSection}
      />
      <main className="pt-16 lg:pt-20 md:pt-16">
        <Inicio />        
        <Carousel />        
        <Historia />
        <Blog />        
        <Location />  {/* Muestra el nuevo mapa aquí */}      
        <Ipalee />        
        <TikTokFeed />        
        <ContactForm />      
        <NewsPopup /> 
      </main>
      <Footer />
    </div>
  )
}
