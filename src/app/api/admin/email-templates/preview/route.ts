import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"
import { getTemplatePreview } from "@/lib/email-templates"

export async function POST(request: NextRequest) {
  try {
    const { templateId, values } = await request.json()

    if (!templateId) {
      return NextResponse.json({ error: "ID de plantilla no proporcionado" }, { status: 400 })
    }

    await connectToDatabase()
    const template = await EmailTemplate.findById(templateId)

    if (!template) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    // Generar vista previa con los valores proporcionados
    const html = getTemplatePreview(template, values)

    return NextResponse.json({ html })
  } catch (error) {
    console.error("Error al generar vista previa:", error)
    return NextResponse.json({ error: "Error al generar vista previa" }, { status: 500 })
  }
}

