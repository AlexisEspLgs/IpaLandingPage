'use client';

import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useAppContext } from '@/contexts/AppContext';

export function Footer() {
  const { theme } = useAppContext();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'} py-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección del logo y el nombre */}
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src={theme === 'dark' ? "/logo-blanco-1024x364.png" : "/logo.jpg"}
              alt="Logo IPA Las Encinas"
              width={320}
              height={320}
              className="object-contain"
            />
          </div>

          {/* Dirección */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-secondary' : 'text-primary'}`}>Dirección</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Candelaria las encinas, sitio 10</p>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Las Encinas, Camino Santa Fé</p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-secondary' : 'text-primary'}`}>Contacto</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Teléfono: (+56) 9 77852776</p>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Email: contacto.ipale@gmail.com</p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="https://m.facebook.com/profile.php?id=100025751512723&_rdr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-secondary' : 'text-gray-600 hover:text-primary'} transition-colors`}
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/ipa.lasencinas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-secondary' : 'text-gray-600 hover:text-primary'} transition-colors`}
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@ipa.las.encinas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-secondary' : 'text-gray-600 hover:text-primary'} transition-colors`}
          >
            <FaTiktok size={24} />
          </a>
        </div>

        {/* Derechos reservados */}
        <div className="mt-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
            &copy; {new Date().getFullYear()} IPA Las Encinas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

