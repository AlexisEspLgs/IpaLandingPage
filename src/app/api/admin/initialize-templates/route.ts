import { NextResponse } from "next/server"
import { initializeDefaultTemplates } from "@/lib/email-templates"

export async function POST() {
  try {
    // Inicializar plantillas predeterminadas
    const result = await initializeDefaultTemplates()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Plantillas inicializadas correctamente",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Error al inicializar plantillas",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error al inicializar plantillas:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar plantillas",
      },
      { status: 500 },
    )
  }
}

