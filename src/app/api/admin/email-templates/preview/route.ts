import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"
import { getTemplatePreview } from "@/lib/email-templates"

export async function POST(request: Request) {
  try {
    const { templateId, values } = await request.json()
    await connectToDatabase()

    const template = await EmailTemplate.findById(templateId)

    if (!template) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    // Generar HTML con los valores proporcionados
    const html = getTemplatePreview(template, values)

    return NextResponse.json({ html })
  } catch (error) {
    console.error("Error al generar vista previa de plantilla:", error)
    return NextResponse.json({ error: "Error al generar vista previa de plantilla" }, { status: 500 })
  }
}

