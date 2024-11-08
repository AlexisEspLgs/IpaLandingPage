'use client'

import { useEffect, useState, useRef } from 'react';
import { Inicio } from '../components/Inicio';
import { Carousel } from '../components/Carousel';
import { Historia } from '../components/Historia';
import { Location } from '../components/Location';
import { Ipalee } from '../components/Ipalee';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { TikTokFeed } from '@/components/TikTokFeed';
import { NewsPopup } from '@/components/NewsPopup';
import Blog from '@/components/Blog';

export default function Home() {

  const [activeSection, setActiveSection] = useState('inicio');
  const navItems = ['inicio', 'fotos', 'historia', 'ubicacion', 'ipalee', 'tiktok', 'contacto'];
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Mover la lógica de scroll a useEffect para asegurar que se ejecute en el cliente
  useEffect(() => {
    // Verificar que `window` esté disponible antes de ejecutar el código
    if (typeof window !== 'undefined') {
      navItems.forEach(item => {
        sectionRefs.current[item.toLowerCase()] = document.getElementById(item.toLowerCase());
      });

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const sections = navItems.map(item => item.toLowerCase());
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sectionRefs.current[sections[i]];
          if (section && section.offsetTop <= currentScrollY + 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    // Verificar si `window` está definido antes de ejecutar
    if (typeof window !== 'undefined') {
      const section = sectionRefs.current[sectionId];
      if (section) {
        const yOffset = -64; // Ajuste del desplazamiento para que coincida con la altura del navbar
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar 
        activeSection={activeSection} 
        navItems={navItems} 
        onNavItemClick={scrollToSection}
      />
      <main className="pt-16 lg:pt-20 md:pt-16"> {/* Ajuste para navbar en pantallas más grandes */}
        <Inicio />        
        <Carousel />        
        <Historia />
        <Blog />        
        <Location />        
        <Ipalee />        
        <TikTokFeed />        
        <ContactForm />      
        <NewsPopup /> 
      </main>
      <Footer />
    </div>
  );
}
