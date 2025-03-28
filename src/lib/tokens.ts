import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Generar token para cancelación de suscripción
export async function generateUnsubscribeToken(email: string): Promise<string> {
  return jwt.sign(
    {
      email,
      purpose: "unsubscribe",
    },
    JWT_SECRET,
    { expiresIn: "30d" }, // El token expira en 30 días
  )
}

// Verificar token de cancelación de suscripción
export async function verifyUnsubscribeToken(token: string): Promise<{ email: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; purpose: string }

    // Verificar que el token sea para cancelación de suscripción
    if (decoded.purpose !== "unsubscribe") {
      return null
    }

    return { email: decoded.email }
  } catch (error) {
    console.error("Error al verificar token de cancelación:", error)
    return null
  }
}

