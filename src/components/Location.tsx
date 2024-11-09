'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function LocationMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=YpGhJSKoKSu5oayHIspN', // Replace with your MapTiler key
        center: [-72.482402, -37.457536],
        zoom: 10
      })

      // Añadir un marcador personalizado
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.backgroundImage = 'url(/pin.svg)'
      el.style.width = '25px'
      el.style.height = '41px'
      el.style.backgroundSize = '100%'

      new maplibregl.Marker(el)
        .setLngLat([-72.482402, -37.457536])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML("<h3 style='color: #333333;'>IPA Las Encinas</h3><p style='color: #666666;'>Candelaria las encinas, sitio 10<br>Las Encinas, Camino Santa Fé</p>")
        )
        .addTo(map)

      // Añadir controles de navegación
      map.addControl(new maplibregl.NavigationControl())

      // Limpiar el mapa cuando el componente se desmonte
      return () => map.remove()
    }
  }, [])

  return (
    <section id="ubicacion" className="py-20 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Nuestra Ubicación</h2>
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />
        </div>
      </div>
    </section>
  )
}