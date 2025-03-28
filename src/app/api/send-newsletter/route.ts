import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import EmailTemplate from "@/models/EmailTemplate"
import { applyTemplateValues } from "@/lib/email-templates"
import { sendNewsletterWithNodemailer } from "@/lib/nodemailer"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: NextRequest) {
  try {
    const { subject, html, templateId, templateValues } = await request.json()

    // Validar que se proporcione el contenido necesario
    if (!subject) {
      return NextResponse.json({ error: "El asunto es obligatorio" }, { status: 400 })
    }

    if (!html && !templateId) {
      return NextResponse.json(
        { error: "Debe proporcionar el contenido HTML o seleccionar una plantilla" },
        { status: 400 },
      )
    }

    // Conectar a la base de datos
    await connectToDatabase()

    // Obtener todos los suscriptores (sin filtrar por active)
    const subscribers = await Subscription.find({})

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No hay suscriptores para enviar el newsletter" }, { status: 400 })
    }

    // Preparar el contenido HTML
    let htmlContent = html

    // Si se está usando una plantilla, obtenerla y aplicar los valores
    if (templateId) {
      const template = await EmailTemplate.findById(templateId)
      if (!template) {
        return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
      }

      // Convertir valores booleanos de string a boolean
      const processedValues: Record<string, string | boolean> = {}
      Object.entries(templateValues).forEach(([key, value]) => {
        if (key.startsWith("show") && (value === "true" || value === "false")) {
          processedValues[key] = value === "true"
        } else {
          processedValues[key] = value as string | boolean
        }
      })

      // Aplicar los valores a la plantilla
      const stringValues: Record<string, string> = {}
      Object.entries(processedValues).forEach(([key, value]) => {
        stringValues[key] = value.toString()
      })
      htmlContent = applyTemplateValues(template.htmlContent, stringValues)
    }

    await logActivity({
      action: "newsletter_sent",
      details: `Newsletter enviado a suscriptores. Asunto: ${subject}`,
      userId: "system",
      userEmail: "system",
    })

    // Obtener los emails de los suscriptores
    const emails = subscribers.map((sub) => sub.email)

    // Enviar el newsletter
    const result = await sendNewsletterWithNodemailer(emails, subject, htmlContent)

    if (!result.success) {
      throw new Error("Error al enviar el newsletter")
    }


    return NextResponse.json({
      success: true,
      message: `Newsletter enviado a ${emails.length} suscriptores`,
    })
  } catch (error) {
    console.error("Error al enviar newsletter:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar newsletter" },
      { status: 500 },
    )
  }
}

