import nodemailer from "nodemailer"

// Crear un transporter reutilizable
let transporter: nodemailer.Transporter

// Inicializar el transporter
export function initNodemailer() {
  // Verificar si ya está inicializado
  if (transporter) return transporter

  // Crear nuevo transporter
  transporter = nodemailer.createTransport({
    service: "gmail", // Puedes cambiarlo por otro servicio como 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Usa una contraseña de aplicación para Gmail
    },
  })

  return transporter
}

// Función para enviar email
export async function sendEmailWithNodemailer(to: string | string[], subject: string, html: string) {
  try {
    // Asegurarse de que el transporter esté inicializado
    if (!transporter) {
      initNodemailer()
    }

    // Enviar el email
    const info = await transporter.sendMail({
      from: '"IPA Las Encinas" <noreply@ipalasencinas.com>', // Puedes personalizarlo
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html,
    })

    console.log("Email enviado con Nodemailer:", info.messageId)
    return { success: true, data: info }
  } catch (error) {
    console.error("Error al enviar email con Nodemailer:", error)
    return { success: false, error }
  }
}

// Función para enviar newsletter a múltiples destinatarios
export async function sendNewsletterWithNodemailer(recipients: string[], subject: string, html: string) {
  try {
    // Para envíos masivos, es mejor enviar en lotes para evitar límites
    const batchSize = 50 // Ajusta según los límites de tu proveedor
    const batches = []

    // Dividir los destinatarios en lotes
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      batches.push(batch)
    }

    // Enviar cada lote con un pequeño retraso para evitar bloqueos
    const results = []
    for (const batch of batches) {
      const result = await sendEmailWithNodemailer(batch, subject, html)
      results.push(result)

      // Pequeña pausa entre lotes
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }
    }

    // Verificar resultados
    return {
      success: true,
      message: `Newsletter enviado a ${recipients.length} suscriptores`,
      details: results,
    }
  } catch (error) {
    console.error("Error al enviar newsletter con Nodemailer:", error)
    return { success: false, error }
  }
}

