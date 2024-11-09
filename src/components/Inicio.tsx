import Image from 'next/image'

export function Inicio() {
  return (
    <section id="inicio" className="pt-8 bg-gradient-to-r from-primary to-secondary text-white min-h-screen flex items-center">
      <div className="container mx-auto text-center px-4">
        <Image
          src="/logo.jpg"
          alt="IPA Las Encinas Logo"
          width={200}
          height={200}
          className="mx-auto -mt-12 mb-10 rounded-full border-4 border-white shadow-lg animate-pulse"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">
          Bienvenidos a IPA Las Encinas
        </h1>
        <p className="text-xl md:text-2xl mb-4 animate-fade-in-up">
          Iglesia Pentecostal Apostólica
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-colors duration-300 animate-fade-in-left"
          >
            Contáctanos
          </button>
          <button
            onClick={() => document.getElementById('historia')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-colors duration-300 animate-fade-in-right"
          >
            Nuestra Historia
          </button>
        </div>
      </div>
    </section>
  )
}
