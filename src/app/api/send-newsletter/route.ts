import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { sendEmailWithNodemailer } from "@/lib/nodemailer"
import { applyTemplateValues } from "@/lib/email-templates"
import EmailTemplate from "@/models/EmailTemplate"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, html, templateId, templateValues } = body

    if (!subject) {
      return NextResponse.json({ error: "El asunto es requerido" }, { status: 400 })
    }

    // Obtener todos los suscriptores
    await connectToDatabase()
    const subscriptions = await Subscription.find({})

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "No hay suscriptores para enviar el newsletter" }, { status: 400 })
    }

    // Determinar el contenido HTML a enviar
    let htmlContent = html

    // Si se proporciona un ID de plantilla, obtener la plantilla y aplicar los valores
    if (templateId) {
      // Obtener la plantilla directamente desde MongoDB
      const template = await EmailTemplate.findById(templateId)

      if (!template) {
        return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
      }

      // Aplicar los valores a la plantilla
      if (templateValues && Object.keys(templateValues).length > 0) {
        htmlContent = applyTemplateValues(template.htmlContent, templateValues)
      } else {
        htmlContent = template.htmlContent
      }
    }

    if (!htmlContent) {
      return NextResponse.json({ error: "El contenido HTML es requerido" }, { status: 400 })
    }

    // Enviar email a cada suscriptor
    const emailPromises = subscriptions.map(async (subscription) => {
      return sendEmailWithNodemailer(subscription.email, subject, htmlContent)
    })

    await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: `Newsletter enviado exitosamente a ${subscriptions.length} suscriptores`,
      count: subscriptions.length,
    })
  } catch (error) {
    console.error("Error al enviar newsletter:", error)
    return NextResponse.json({ error: "Error al enviar newsletter" }, { status: 500 })
  }
}

