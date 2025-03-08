"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loginUser, resetPassword } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { Home, Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin/dashboard")
    }
  }, [user, loading, router])

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!re.test(email)) {
      setEmailError("Por favor, ingrese un correo electrónico válido.")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.")
      return false
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra mayúscula.")
      return false
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra minúscula.")
      return false
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número.")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)
    try {
      await loginUser(email, password)
      router.push("/admin/dashboard")
    } catch {
      console.error("Sign in error")
      setError("Credenciales inválidas. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      return
    }
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const result = await resetPassword(email)
      if (result.success) {
        setSuccessMessage(result.message)
        setTimeout(() => setIsRecoveryMode(false), 3000)
      } else {
        setError(result.message)
      }
    } catch {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-r from-violet-600 to-purple-600"
      >
        <div className="animate-pulse flex flex-col items-center text-white">
          <ShieldCheck className="w-12 h-12 mb-4 animate-bounce" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </motion.div>
    )
  }

  if (user) {
    return null
  }

  return (
    <motion.div
      initial={{ background: "linear-gradient(to right, rgb(124, 58, 237), rgb(76, 29, 149))" }}
      animate={{
        background: "linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))",
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="flex min-h-screen p-4 sm:p-8 bg-primary-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg m-auto"
      >
        <Card className="relative overflow-hidden animate-fadeIn bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <CardHeader className="relative space-y-1 flex flex-col items-center pt-8">
            <motion.div
              className="rounded-full bg-primary/10 p-4 mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShieldCheck className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Inicia sesión para acceder a tu panel de control</p>
          </CardHeader>

          <CardContent className="relative space-y-4 pt-4">
            {isRecoveryMode ? (
              <form className="mt-8 space-y-6" onSubmit={handlePasswordRecovery}>
                <div>
                  <Label htmlFor="email-address" className="sr-only">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      validateEmail(e.target.value)
                    }}
                    className={cn(
                      "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                      emailError && "border-red-500",
                    )}
                    placeholder="Correo electrónico"
                  />
                  {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                </div>
                <div>
                  <Button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isLoading || !!emailError}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                    </span>
                    {isLoading ? "Enviando..." : "Enviar correo de recuperación"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 dark:text-white">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      validateEmail(e.target.value)
                    }}
                    required
                    className={cn(
                      "transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-gray-300 dark:border-gray-700",
                      emailError && "border-red-500",
                    )}
                    placeholder="admin@example.com"
                    disabled={isLoading}
                  />
                  {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 dark:text-white">
                      <Lock className="w-4 h-4" />
                      Contraseña
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          validatePassword(e.target.value)
                        }}
                        required
                        className={cn(
                          "transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-gray-300 dark:border-gray-700 pr-10",
                          passwordError && "border-red-500",
                        )}
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
                  </div>
                </motion.div>

                {error && (
                  <Alert className="mt-4" variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200 hover:scale-[1.02] bg-indigo-600 text-white dark:bg-indigo-700 dark:text-white"
                    disabled={isLoading || !!emailError || !!passwordError}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}

            {!isRecoveryMode && (
              <div className="text-sm mt-3">
                <button
                  onClick={() => setIsRecoveryMode(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {isRecoveryMode && (
              <div className="text-sm mt-3">
                <button
                  onClick={() => setIsRecoveryMode(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}

            {successMessage && (
              <Alert className="mt-4" variant="default">
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="relative flex justify-center pb-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
                    <Home className="w-4 h-4 mr-2" />
                    Volver a la Pagina Principal
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -50, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-white/20 rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  )
}

