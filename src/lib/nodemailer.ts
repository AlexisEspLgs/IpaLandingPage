import nodemailer from "nodemailer"
import { getWelcomeTemplate, applyTemplateValues } from "./email-templates"
import { generateUnsubscribeToken } from "./tokens"

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

// Plantilla de bienvenida de respaldo (fallback) en caso de error con la base de datos
const fallbackWelcomeTemplate = {
  htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a IPA Las Encinas</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header { 
          background-color: #4f46e5; 
          padding: 20px;
          text-align: center;
          color: white;
          border-radius: 5px 5px 0 0;
        }
        .content { 
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
        }
        .footer { 
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #666;
        }
        img.logo { 
          max-width: 150px;
          margin-bottom: 10px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 15px 0;
        }
        .unsubscribe {
          color: #666;
          text-decoration: underline;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://res.cloudinary.com/dvpzbs3mm/image/upload/v1742590484/logo-blanco-1024x364_h1bw5u.png" alt="Logo" class="logo">
        <h1>¡Bienvenido a nuestra comunidad!</h1>
      </div>
      <div class="content">
        <p>Estimado(a) {{name}}:</p>
        <p>Gracias por suscribirte a nuestro boletín informativo. Estamos muy contentos de tenerte como parte de nuestra comunidad.</p>
        <p>A partir de ahora, recibirás actualizaciones sobre nuestras actividades, eventos especiales y noticias importantes de nuestra iglesia.</p>
        <a href="https://ipa-las-encinas.netlify.app/" class="button">Visitar Nuestro Sitio</a>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} IPA Las Encinas. Todos los derechos reservados.</p>
        <p><a href="{{unsubscribeUrl}}" class="unsubscribe">Si no desea recibir más correos, haga clic aquí para darse de baja</a></p>
      </div>
    </body>
    </html>
  `,
}

// Función para enviar un correo electrónico
export async function sendEmail({
  to,
  subject,
  html,
  from = `IPA Las Encinas <${process.env.EMAIL_USER}>`,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error al enviar correo:", error)
    return { success: false, error }
  }
}

// Función para enviar un correo de bienvenida a un nuevo suscriptor
export async function sendWelcomeEmail({
  email,
  name = "",
}: {
  email: string
  name?: string
}) {
  try {
    // Generar token de cancelación de suscripción
    const unsubscribeToken = await generateUnsubscribeToken(email)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ipa-las-encinas.netlify.app"
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`

    // Intentar obtener la plantilla de bienvenida de la base de datos
    let welcomeTemplate
    let htmlContent

    try {
      welcomeTemplate = await getWelcomeTemplate()

      if (welcomeTemplate) {
        // Preparar los valores para la plantilla
        const values: Record<string, string | boolean> = {
          greeting: name ? `Estimado(a) ${name}:` : "Estimado(a) suscriptor(a):",
          showLogo: true,
          logoUrl: "https://res.cloudinary.com/dvpzbs3mm/image/upload/v1742590484/logo-blanco-1024x364_h1bw5u.png",
          welcomeMessage:
            "Gracias por suscribirte a nuestro boletín informativo. Estamos muy contentos de tenerte como parte de nuestra comunidad.",
          benefitsMessage:
            "A partir de ahora, recibirás actualizaciones sobre nuestras actividades, eventos especiales y noticias importantes de nuestra iglesia.",
          buttonText: "Visitar Nuestro Sitio",
          buttonColor: "#4f46e5",
          websiteUrl: "https://ipa-las-encinas.netlify.app/",
          footerText: `Si no desea recibir más correos, <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">haga clic aquí para darse de baja</a>.`,
          currentYear: new Date().getFullYear().toString(),
          headerColor: "#4f46e5",
          unsubscribeUrl: unsubscribeUrl,
        }

        // Aplicar los valores a la plantilla
        htmlContent = applyTemplateValues(welcomeTemplate.htmlContent, values)
      } else {
        throw new Error("No se encontró la plantilla de bienvenida")
      }
    } catch (dbError) {
      console.warn(
        "Error al obtener plantilla de bienvenida de la base de datos, usando plantilla de respaldo:",
        dbError,
      )

      // Usar la plantilla de respaldo si hay un error con la base de datos
      const fallbackValues: Record<string, string> = {
        name: name || "suscriptor(a)",
        unsubscribeUrl: unsubscribeUrl,
      }

      // Aplicar valores a la plantilla de respaldo
      htmlContent = fallbackWelcomeTemplate.htmlContent
        .replace(/{{name}}/g, fallbackValues.name)
        .replace(/{{unsubscribeUrl}}/g, fallbackValues.unsubscribeUrl)
    }

    // Enviar el correo con la plantilla que tengamos disponible
    const result = await sendEmail({
      to: email,
      subject: "¡Bienvenido a IPA Las Encinas!",
      html: htmlContent,
    })

    return result
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error)
    // No lanzar el error, solo devolver un objeto de error
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Función para enviar newsletter a múltiples destinatarios
export async function sendNewsletterWithNodemailer(recipients: string[], subject: string, htmlTemplate: string) {
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
      // Procesar cada email individualmente para añadir el token de cancelación
      for (const email of batch) {
        // Generar token de cancelación para este email
        const unsubscribeToken = await generateUnsubscribeToken(email)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ipa-las-encinas.netlify.app"
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`

        // Reemplazar el marcador de posición con la URL real
        let personalizedHtml = htmlTemplate.replace(/{{unsubscribeUrl}}/g, unsubscribeUrl)

        // Si hay un texto genérico de cancelación, reemplazarlo con un enlace
        personalizedHtml = personalizedHtml.replace(
          /Si no desea recibir más correos, puede darse de baja haciendo clic aquí\./g,
          `Si no desea recibir más correos, <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">haga clic aquí para darse de baja</a>.`,
        )

        // Enviar el correo personalizado
        const result = await sendEmail({
          to: email,
          subject,
          html: personalizedHtml,
        })

        results.push(result)
      }

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

