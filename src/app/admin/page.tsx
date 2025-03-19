"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { loginUser, resetPassword } from "@/lib/firebase"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir automáticamente al dashboard
    if (!loading && user) {
      router.push("/admin/dashboard")
    }
  }, [user, loading, router])

  // Efecto para el contador regresivo después de enviar el correo de recuperación
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && success && isRecoveryMode) {
      // Volver al modo de login después de que termine la cuenta regresiva
      setIsRecoveryMode(false)
      setSuccess("")
    }
  }, [countdown, success, isRecoveryMode])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await loginUser(email, password)
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error logging in:", error)
      setError("Credenciales inválidas. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const result = await resetPassword(email)
      if (result.success) {
        setSuccess(result.message)
        setCountdown(5) // Iniciar cuenta regresiva de 5 segundos
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      setError("Error al enviar el correo de recuperación. Por favor, intenta de nuevo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode)
    setError("")
    setSuccess("")
  }

  // Si está cargando, mostrar un indicador de carga animado
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 rounded-full border-blue-500 border-t-transparent dark:border-purple-500 dark:border-t-transparent"
        />
      </div>
    )
  }

  // Si no hay usuario autenticado, mostrar el formulario correspondiente
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.jpg"
                  alt="IPA Las Encinas Logo"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white shadow-md"
                />
              </div>
              <CardTitle className="text-2xl font-bold">
                {isRecoveryMode ? "Recuperar Contraseña" : "Panel de Administración"}
              </CardTitle>
              <CardDescription>
                {isRecoveryMode
                  ? "Ingresa tu correo electrónico para recibir instrucciones"
                  : "Ingresa tus credenciales para acceder"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <AlertDescription>
                    {success}
                    {countdown > 0 && (
                      <span className="block mt-2 text-sm">
                        Volviendo al inicio de sesión en {countdown} segundo{countdown !== 1 ? "s" : ""}...
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {isRecoveryMode ? (
                // Formulario de recuperación de contraseña
                <form onSubmit={handleRecoverySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Email</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                      disabled={!!success}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isSubmitting || !!success}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Enviar Instrucciones"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center mt-2"
                    onClick={toggleRecoveryMode}
                    disabled={!!success}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Inicio de Sesión
                  </Button>
                </form>
              ) : (
                // Formulario de inicio de sesión
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Contraseña</Label>
                      <button
                        type="button"
                        onClick={toggleRecoveryMode}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                  <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center mt-2">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver al sitio principal
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 bg-gray-50 dark:bg-gray-800/50 p-6">
              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                {isRecoveryMode
                  ? "Recibirás un correo con instrucciones para restablecer tu contraseña"
                  : "Este panel es exclusivo para administradores autorizados de IPA Las Encinas."}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Este return nunca debería ejecutarse debido a la redirección en el useEffect
  return null
}

