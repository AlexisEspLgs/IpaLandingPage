import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';

export function NewsPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Espera 5 segundos y luego muestra el popup
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // 5 segundos

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleDownload = () => {
    // Crear un enlace temporal para descargar el PDF
    const link = document.createElement('a');
    link.href = '/evento_sabado.pdf'; // Asegúrate de que el PDF esté en la carpeta public
    link.download = 'evento_sabado.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-4xl w-full flex flex-col md:flex-row items-center animate-slide-in">
            {/* Logo de la iglesia */}
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              <Image
                src="/logo.jpg" // Asegúrate de que el logo esté en la carpeta public
                alt="IPA Las Encinas Logo"
                width={120}
                height={120}
                className="rounded-full border-4 border-primary shadow-md"
              />
            </div>

            {/* Mensaje de la noticia */}
            <div className="w-full md:w-2/3 text-center md:text-left px-4 md:pl-8">
              <h2 className="text-xl md:text-3xl font-bold text-primary mb-2 md:mb-4">¡Noticia Importante!</h2>
              <p className="text-sm md:text-lg text-gray-700 mb-4 md:mb-6">
                La iglesia estará realizando un evento especial este fin de semana. ¡No te lo pierdas!
                Ven y acompáñanos para disfrutar de un tiempo de alabanza y reflexión juntos. ¡Dios tiene algo
                especial para ti!
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-secondary text-white px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-secondary-dark transition-colors duration-300 flex items-center"
                >
                  <Download className="mr-2" size={20} />
                  Descargar Información
                </button>
                <button
                  onClick={closePopup}
                  className="bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-primary-dark transition-colors duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}