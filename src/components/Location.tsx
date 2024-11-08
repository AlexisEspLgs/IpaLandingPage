'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const icon = new L.Icon({
  iconUrl: '/pin.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export function Location() {
  const position: L.LatLngExpression = [-37.457536, -72.482402] // Coordenadas de la iglesia

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: '/pin.svg',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    })
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  return (
    <section id="ubicacion" className="py-20 bg-gray scroll-offset">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Nuestra Ubicación</h2>
        <div className="w-full max-w-4xl mx-auto rounded-lg  shadow-lg">
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '350px', width: 'auto', position:'sticky' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={icon}>
              <Popup>
                IPA Las Encinas <br /> Candelaria las encinas, sitio 10 <br /> Las Encinas, Camino Santa Fé
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  )
}