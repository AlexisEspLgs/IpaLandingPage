import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { verifyUnsubscribeToken } from "@/lib/tokens"

// Procesar solicitud GET para cancelar suscripción directamente desde un enlace
export async function GET(request: NextRequest) {
  try {
    // Obtener el token de la URL
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/unsubscribe?error=token_missing", request.url))
    }

    // Verificar el token
    const tokenData = await verifyUnsubscribeToken(token)

    if (!tokenData) {
      return NextResponse.redirect(new URL("/unsubscribe?error=token_invalid", request.url))
    }

    // Conectar a la base de datos
    await connectToDatabase()

    // Buscar la suscripción
    const subscription = await Subscription.findOne({ email: tokenData.email })

    if (!subscription) {
      return NextResponse.redirect(new URL("/unsubscribe?error=not_found", request.url))
    }

    // Desactivar la suscripción en lugar de eliminarla
    await Subscription.updateOne({ email: tokenData.email }, { $set: { active: false } })


    // Redirigir a la página de éxito
    return NextResponse.redirect(new URL("/unsubscribe/success", request.url))
  } catch (error) {
    console.error("Error al procesar cancelación de suscripción:", error)
    return NextResponse.redirect(new URL("/unsubscribe?error=server_error", request.url))
  }
}

// Procesar solicitud POST para iniciar el proceso de cancelación
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email requerido" }, { status: 400 })
    }

    // Conectar a la base de datos
    await connectToDatabase()

    // Verificar si el email existe
    const subscription = await Subscription.findOne({ email })

    if (!subscription) {
      return NextResponse.json({ success: false, error: "Email no encontrado" }, { status: 404 })
    }

    // Generar token de cancelación
    const token = await verifyUnsubscribeToken(email)

    // Construir URL de cancelación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ipa-las-encinas.netlify.app"
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`

    return NextResponse.json({
      success: true,
      message: "Proceso de cancelación iniciado",
      unsubscribeUrl,
    })
  } catch (error) {
    console.error("Error al iniciar proceso de cancelación:", error)
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 })
  }
}

