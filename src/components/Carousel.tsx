'use client'

import { useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const photos = [
  { id: 1, src: '/EncuentroMujeres.jpg', alt: 'Encuentro de Mujeres' },
  { id: 2, src: '/EncuentroMujeres.jpg', alt: 'Foto 2' },
  { id: 3, src: '/EncuentroMujeres.jpg', alt: 'Foto 3' },
]

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  }

  return (
    <section id="fotos" className="py-12 bg-background">
      <div className="container mx-auto mb-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Nuestra Galería</h2>
        <div className="relative max-w-4xl mx-auto mb-8">
          <Slider {...settings}>
            {photos.map((photo) => (
              <div key={photo.id} className="relative h-64 md:h-96">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </Slider>
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded mb-4">
            {currentSlide + 1} / {photos.length}
          </div>
        </div>
      </div>
    </section>
  )
}