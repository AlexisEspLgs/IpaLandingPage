// components/NewsPopup.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function NewsPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Espera 10 segundos y luego muestra el popup
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // 10 segundos

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex items-center animate-slide-in">
            {/* Logo de la iglesia */}
            <div className="w-1/3 flex justify-center">
              <Image
                src="/logo.jpg" // Asegúrate de que el logo esté en la carpeta public
                alt="IPA Las Encinas Logo"
                width={120} // Ajusta el tamaño según lo necesites
                height={120}
                className="rounded-full border-4 border-primary shadow-md"
              />
            </div>

            {/* Mensaje de la noticia */}
            <div className="w-2/3 pl-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">¡Noticia Importante!</h2>
              <p className="text-lg md:text-xl text-gray-700 mb-6">
                La iglesia estará realizando un evento especial este fin de semana. ¡No te lo pierdas!
                Ven y acompáñanos para disfrutar de un tiempo de alabanza y reflexión juntos. ¡Dios tiene algo
                especial para ti!
              </p>
              <div className="flex justify-end">
                <button
                  onClick={closePopup}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors duration-300"
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
