import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { email } = await request.json()

    // Verificar si el email ya existe
    const existingSubscription = await Subscription.findOne({ email })

    if (existingSubscription) {
      // Si existe pero está inactivo, reactivarlo
      if (!existingSubscription.active) {
        existingSubscription.active = true
        await existingSubscription.save()
        return NextResponse.json({
          success: true,
          message: "Suscripción reactivada correctamente",
        })
      }

      // Si ya está activo, informar que ya está suscrito
      return NextResponse.json(
        {
          success: false,
          message: "Este email ya está suscrito",
        },
        { status: 400 },
      )
    }

    // Crear nueva suscripción
    const subscription = await Subscription.create({
      email,
      active: true,
    })

    return NextResponse.json({
      success: true,
      message: "Suscripción creada correctamente",
      data: subscription,
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear la suscripción",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 })
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

