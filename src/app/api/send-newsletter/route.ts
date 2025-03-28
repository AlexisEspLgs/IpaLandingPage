import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { sendNewsletterWithNodemailer } from "@/lib/nodemailer"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { subject, htmlContent } = await request.json()

    if (!subject || !htmlContent) {
      return NextResponse.json({ success: false, message: "Se requiere asunto y contenido HTML" }, { status: 400 })
    }

    // Buscar solo suscriptores activos
    const subscribers = await Subscription.find({ active: true })

    if (subscribers.length === 0) {
      return NextResponse.json({ success: false, message: "No hay suscriptores activos" }, { status: 404 })
    }

    const recipientEmails = subscribers.map((sub) => sub.email)

    const result = await sendNewsletterWithNodemailer(recipientEmails, subject, htmlContent)

    // Registrar la actividad
    await logActivity({
      action: "newsletter_sent",
      details: `Newsletter enviado a ${recipientEmails.length} suscriptores. Asunto: ${subject}`,
      userId: "system",
      userEmail: "system",
    })

    return NextResponse.json({
      success: true,
      message: `Newsletter enviado a ${recipientEmails.length} suscriptores`,
      result,
    })
  } catch (error) {
    console.error("Error al enviar newsletter:", error)
    return NextResponse.json({ success: false, message: "Error al enviar newsletter", error }, { status: 500 })
  }
}

