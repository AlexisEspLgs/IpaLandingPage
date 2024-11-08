'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

const photos = [
  { id: 1, src: '/placeholder.svg?height=600&width=800', alt: 'Foto 1', description: 'Descripción de la foto 1' },
  { id: 2, src: '/placeholder.svg?height=600&width=800', alt: 'Foto 2', description: 'Descripción de la foto 2' },
  { id: 3, src: '/placeholder.svg?height=600&width=800', alt: 'Foto 3', description: 'Descripción de la foto 3' },
  // Agrega más fotos según sea necesario
]

export default function PhotoDetail() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const photo = photos.find(p => p.id === Number(id))

  if (!photo) {
    return <div>Foto no encontrada</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="relative h-96">
          <Image
            src={photo.src}
            alt={photo.alt}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#084D6E] mb-4">{photo.alt}</h2>
          <p className="text-gray-600 mb-6">{photo.description}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#084D6E] text-white px-6 py-2 rounded-full font-bold hover:bg-[#0A7CAD] transition-colors"
          >
            Volver a la galería
          </button>
        </div>
      </div>
    </div>
  )
}