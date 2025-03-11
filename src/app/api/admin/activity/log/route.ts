import { NextResponse } from "next/server"
import { logActivity, type LogActivityParams } from "@/lib/activity-logger"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    // Simplificamos la autenticación para este endpoint
    // En un entorno de producción, deberías implementar una verificación adecuada

    // Obtener datos de la actividad
    const data = await request.json()

    // Validar datos requeridos
    if (!data.action) {
      return NextResponse.json({ error: "Se requiere una acción" }, { status: 400 })
    }

    // Preparar parámetros para el registro de actividad
    const activityParams: LogActivityParams = {
      userId: data.userId || "system",
      userEmail: data.userEmail || "system@ipalasencinas.com",
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      details: data.details,
    }

    // Registrar la actividad
    const activity = await logActivity(activityParams)

    if (!activity) {
      return NextResponse.json({ error: "Error al registrar la actividad" }, { status: 500 })
    }

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error("Error al registrar actividad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Simplificamos la autenticación para este endpoint

    // Obtener actividades recientes
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const db = await connectToDatabase()
    if (!db) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    const activities = await db.collection("activitylogs").find({}).sort({ timestamp: -1 }).limit(limit).toArray()

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error al obtener actividades:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

