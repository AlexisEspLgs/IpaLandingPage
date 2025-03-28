import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { logActivity } from "@/lib/activity-logger"
import { sendWelcomeEmail } from "@/lib/nodemailer"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "El email es requerido" }, { status: 400 })
    }

    // Verificar si el email ya existe pero está inactivo
    const existingSubscription = await Subscription.findOne({ email })

    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json({ success: false, message: "Este email ya está suscrito" }, { status: 400 })
      } else {
        // Reactivar la suscripción inactiva
        await Subscription.updateOne({ email }, { $set: { active: true, name: name || existingSubscription.name } })

        // Registrar la actividad
        await logActivity({
          action: "subscription_reactivated",
          details: `Suscripción reactivada: ${email}`,
          userId: "system",
          userEmail: email,
        })

        // Enviar correo de bienvenida
        sendWelcomeEmail({ email, name: name || existingSubscription.name }).catch((error) => {
          console.error("Error al enviar email de bienvenida:", error)
        })

        return NextResponse.json({
          success: true,
          message: "Tu suscripción ha sido reactivada exitosamente",
        })
      }
    }

    // Crear nueva suscripción
    const newSubscription = new Subscription({
      email,
      name,
      active: true,
    })

    await newSubscription.save()

    // Registrar la actividad
    await logActivity({
      action: "new_subscription",
      details: `Nueva suscripción: ${email}`,
      userId: "system",
      userEmail: email,
    })

    // Enviar correo de bienvenida
    sendWelcomeEmail({ email, name }).catch((error) => {
      console.error("Error al enviar email de bienvenida:", error)
    })

    return NextResponse.json({
      success: true,
      message: "Te has suscrito exitosamente",
      subscription: newSubscription,
    })
  } catch (error) {
    console.error("Error al procesar suscripción:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// Modificar la función GET para soportar el filtrado por estado activo
export async function GET(request: Request) {
  try {
    await connectToDatabase()

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const activeParam = searchParams.get("active")

    // Construir el filtro basado en los parámetros
    const filter: { active?: boolean } = {}
    if (activeParam === "true") {
      filter.active = true
    } else if (activeParam === "false") {
      filter.active = false
    }

    const subscriptions = await Subscription.find(filter).sort({ createdAt: -1 })
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

