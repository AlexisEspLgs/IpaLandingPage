import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Endpoint para obtener la configuración actual del directo de Facebook
export async function GET() {
  try {
    console.log("GET /api/admin/facebook-live - Iniciando solicitud")
    const db = await connectToDatabase()
    if (!db) {
      console.error("GET /api/admin/facebook-live - Error de conexión a la base de datos")
      throw new Error("Failed to connect to the database")
    }

    console.log("GET /api/admin/facebook-live - Buscando configuración")
    const config = await db.collection("config").findOne({ name: "facebook_live" })
    console.log("GET /api/admin/facebook-live - Configuración encontrada:", config)

    // Si no existe configuración, devolver valores por defecto
    if (!config) {
      console.log("GET /api/admin/facebook-live - No se encontró configuración, devolviendo valores por defecto")
      return NextResponse.json({
        success: true,
        config: {
          active: false,
          embedCode: "",
          title: "",
          description: "",
          expiresAt: null,
        },
      })
    }

    // Verificar si el directo ha expirado
    if (config.data && config.data.expiresAt && new Date(config.data.expiresAt) < new Date()) {
      console.log("GET /api/admin/facebook-live - El directo ha expirado, actualizando estado")
      // Si ha expirado, actualizar el estado a inactivo en la base de datos
      await db.collection("config").updateOne({ name: "facebook_live" }, { $set: { "data.active": false } })

      // Devolver la configuración con active = false
      return NextResponse.json({
        success: true,
        config: {
          ...config.data,
          active: false,
        },
      })
    }

    console.log("GET /api/admin/facebook-live - Devolviendo configuración:", config.data)
    return NextResponse.json({ success: true, config: config.data })
  } catch (error) {
    console.error("GET /api/admin/facebook-live - Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

// Endpoint para actualizar la configuración del directo de Facebook
export async function POST(request: Request) {
  try {
    console.log("POST /api/admin/facebook-live - Iniciando solicitud")
    const db = await connectToDatabase()
    if (!db) {
      console.error("POST /api/admin/facebook-live - Error de conexión a la base de datos")
      throw new Error("Failed to connect to the database")
    }

    const data = await request.json()
    console.log("POST /api/admin/facebook-live - Datos recibidos:", data)

    // Validar los datos recibidos
    if (data.active && !data.embedCode) {
      console.log("POST /api/admin/facebook-live - Error de validación: falta código de incrustación")
      return NextResponse.json(
        { success: false, error: "El código de incrustación es obligatorio cuando el directo está activo" },
        { status: 400 },
      )
    }

    // Actualizar o crear la configuración
    console.log("POST /api/admin/facebook-live - Actualizando configuración")
    await db.collection("config").updateOne({ name: "facebook_live" }, { $set: { data } }, { upsert: true })

    console.log("POST /api/admin/facebook-live - Configuración actualizada con éxito")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/admin/facebook-live - Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

