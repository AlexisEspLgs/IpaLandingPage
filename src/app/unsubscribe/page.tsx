"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Por favor, introduce tu dirección de correo electrónico")
      return
    }

    try {
      setStatus("loading")

      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        setMessage("Se ha enviado un enlace de cancelación a tu correo electrónico")

        // Redirigir directamente si tenemos la URL (para desarrollo/pruebas)
        if (data.unsubscribeUrl) {
          router.push(data.unsubscribeUrl)
        }
      } else {
        setStatus("error")
        setMessage(data.message || "Error al procesar la solicitud")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Error al conectar con el servidor")
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cancelar suscripción</h1>
          <p className="text-gray-600">Introduce tu correo electrónico para cancelar tu suscripción</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          {status === "error" && <div className="p-3 bg-red-100 text-red-700 rounded-md">{message}</div>}

          {status === "success" && <div className="p-3 bg-green-100 text-green-700 rounded-md">{message}</div>}

          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
              Volver al inicio
            </Link>

            <button
              type="submit"
              disabled={status === "loading"}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                status === "loading" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status === "loading" ? "Procesando..." : "Cancelar suscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

