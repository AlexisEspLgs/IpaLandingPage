'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

export function NewsPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const { theme } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/evento_sabado.pdf';
    link.download = 'evento_sabado.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } p-4 md:p-8 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-4xl w-full flex flex-col md:flex-row items-center animate-slide-in`}>
        <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
          <Image
            src="/logo.jpg"
            alt="IPA Las Encinas Logo"
            width={120}
            height={120}
            className={`rounded-full border-4 ${
              theme === 'dark' ? 'border-blue-400' : 'border-primary'
            } shadow-md`}
          />
        </div>

        <div className="w-full md:w-2/3 text-center md:text-left px-4 md:pl-8">
          <h2 className={`text-xl md:text-3xl font-bold mb-2 md:mb-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-primary'
          }`}>
            ¡Noticia Importante!
          </h2>
          <p className={`text-sm md:text-lg mb-4 md:mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            La iglesia estará realizando un evento especial este fin de semana. ¡No te lo pierdas!
            Ven y acompáñanos para disfrutar de un tiempo de alabanza y reflexión juntos. ¡Dios tiene algo
            especial para ti!
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDownload}
              className={`${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-secondary hover:bg-secondary-dark'
              } text-white px-4 py-2 md:px-6 md:py-3 rounded-md transition-colors duration-300 flex items-center`}
            >
              <Download className="mr-2" size={20} />
              Descargar Información
            </button>
            <button
              onClick={closePopup}
              className={`${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-primary hover:bg-primary-dark'
              } text-white px-4 py-2 md:px-6 md:py-3 rounded-md transition-colors duration-300`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

