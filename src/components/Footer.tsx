import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">IPA Las Encinas</h3>
            <p className="text-gray-400">Iglesia Pentecostal Apostólica</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">Dirección</h3>
            <p className="text-gray-400">Candelaria las encinas, sitio 10</p>
            <p className="text-gray-400">Las Encinas, Camino Santa Fé</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">Contacto</h3>
            <p className="text-gray-400">Teléfono: (123) 456-7890</p>
            <p className="text-gray-400">Email: info@ipalasencinas.com</p>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="https://m.facebook.com/profile.php?id=100025751512723&_rdr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-secondary transition-colors">
            <FaFacebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-secondary transition-colors">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.tiktok.com/@ipa.las.encinas" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-secondary transition-colors">
            <FaTiktok size={24} />
          </a>
        </div>
        <div className="mt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} IPA Las Encinas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}