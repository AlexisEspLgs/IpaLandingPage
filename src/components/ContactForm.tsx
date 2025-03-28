"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import emailjs from "@emailjs/browser"
import { useAppContext } from "@/contexts/AppContext"
import type React from "react"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const { theme } = useAppContext()

  // Inicializar EmailJS una vez al cargar el componente
  useEffect(() => {
    // Inicializar EmailJS con tu clave pública
    if (process.env.NEXT_PUBLIC_EMAILJS_USER_ID) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitStatus("error")
      setSubmitMessage("Por favor, completa todos los campos.")
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitStatus(null)

    try {
      // Verificar que las variables de entorno estén definidas
      if (
        !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
        !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
        !process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      ) {
        throw new Error("Faltan configuraciones de EmailJS")
      }

      // Crear el objeto de plantilla con los datos del formulario
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: "Administrador IPA Las Encinas",
        reply_to: email,
      }

      // Enviar el email usando la versión más reciente de la API
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
      )

      console.log("Email enviado con éxito:", response)

      // Limpiar el formulario después de enviar
      setName("")
      setEmail("")
      setMessage("")
      setSubmitStatus("success")
      setSubmitMessage("¡Mensaje enviado! Gracias por contactarnos.")
    } catch (error) {
      console.error("Error al enviar email:", error)
      setSubmitStatus("error")
      setSubmitMessage("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-primary"}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-4">¡Dios te bendiga! ¿En qué podemos orar por ti?</h2>
          <p className="text-white text-lg">
            Si tienes alguna petición, duda o deseas saber más sobre nuestro ministerio, no dudes en escribirnos.
            Estamos para servirte en el amor de Cristo.
          </p>
        </div>
        <div className="md:w-1/2 max-w-md w-full">
          <form
            onSubmit={handleSubmit}
            className={`${theme === "dark" ? "bg-gray-700" : "bg-white"} p-8 rounded-lg shadow-lg`}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "dark"
                    ? "text-white bg-gray-600 focus:bg-gray-500"
                    : "text-gray-700 bg-gray-100 focus:bg-white"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "dark"
                    ? "text-white bg-gray-600 focus:bg-gray-500"
                    : "text-gray-700 bg-gray-100 focus:bg-white"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                Mensaje
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "dark"
                    ? "text-white bg-gray-600 focus:bg-gray-500"
                    : "text-gray-700 bg-gray-100 focus:bg-white"
                }`}
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-primary text-white hover:bg-secondary"
              }`}
            >
              <Send className="mr-2" size={18} />
              {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
            </button>
            {submitMessage && (
              <p
                className={`mt-4 text-center ${
                  submitStatus === "success"
                    ? theme === "dark"
                      ? "text-green-300"
                      : "text-green-600"
                    : theme === "dark"
                      ? "text-red-300"
                      : "text-red-600"
                }`}
              >
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

