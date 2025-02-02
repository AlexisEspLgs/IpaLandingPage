'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import PinIcon from '../../public/pin.png';

export default function LocationMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { theme } = useAppContext();

  useEffect(() => {
    if (mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style:  'https://api.maptiler.com/maps/streets/style.json?key=YpGhJSKoKSu5oayHIspN',
        center: [-72.482402, -37.457536],
        zoom: 10,
        touchZoomRotate: false,
      });

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = `url(${PinIcon.src})`;
      el.style.width = '25px';
      el.style.height = '41px';
      el.style.backgroundSize = '100%';

      new maplibregl.Marker(el)
        .setLngLat([-72.482402, -37.457536])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div style="color: ${theme === 'dark' ? '#ffffff' : '#333333'}; background-color: ${theme === 'dark' ? '#333333' : '#ffffff'}; padding: 10px; border-radius: 5px;">
                <h3 style="color: ${theme === 'dark' ? '#ffffff' : '#333333'}; margin-bottom: 5px;">IPA Las Encinas</h3>
                <p style="color: ${theme === 'dark' ? '#cccccc' : '#666666'};">Candelaria las encinas, sitio 10<br>Las Encinas, Camino Santa Fé</p>
              </div>
            `)
        )
        .addTo(map);

      map.addControl(new maplibregl.NavigationControl());

      return () => map.remove();
    }
  }, [theme]);

  return (
    <section id="ubicacion" className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-background'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-primary'} text-center`}>
            Nuestra Ubicación
          </h2>
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="ml-2"
          >
            <Image 
              src={PinIcon} 
              alt="Pin de mapa" 
              width={32} 
              height={32} 
              className={`transform rotate-12 ${theme === 'dark' ? 'filter invert' : ''}`} 
            />
          </motion.div>
        </div>
        <div className={`relative w-full h-96 rounded-lg overflow-hidden shadow-lg ${theme === 'dark' ? 'shadow-gray-700' : 'shadow-gray-300'}`}>
          <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />
        </div>
      </div>
    </section>
  );
}

