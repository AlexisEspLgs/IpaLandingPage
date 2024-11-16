'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import Swal from 'sweetalert2';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: '¡Mensaje enviado!',
      text: '¡Que Dios te bendiga! Hemos recibido tu mensaje.',
      icon: 'success',
      confirmButtonText: 'Cerrar',
      customClass: {
        confirmButton: 'bg-primary text-white rounded-lg px-6 py-2',
      },
    });

    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contacto" className="py-20 bg-primary">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Dios te bendiga! ¿En qué podemos orar por ti?
          </h2>
          <p className="text-white text-lg">
            Si tienes alguna petición, duda o deseas saber más sobre nuestro ministerio, no dudes en escribirnos. Estamos para servirte en el amor de Cristo.
          </p>
        </div>
        <div className="md:w-1/2 max-w-md w-full">
          <form
            onSubmit={handleSubmit}
            action="https://formsubmit.co/alexislake26@gmail.com" // Reemplaza con tu email registrado en FormSubmit
            method="POST"
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-colors duration-300 flex items-center justify-center"
            >
              <Send className="mr-2" size={18} />
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
