import {  NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"

// Plantillas predeterminadas
const defaultTemplates = [
  {
    name: "Plantilla Básica",
    description: "Una plantilla simple con encabezado, contenido y pie de página",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{title}}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: {{textColor}}; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #ffffff; 
          }
          .header { 
            background-color: {{primaryColor}}; 
            padding: 20px; 
            text-align: center; 
            color: white; 
          }
          .content { 
            padding: 20px; 
          }
          .footer { 
            background-color: #f4f4f4; 
            padding: 15px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
          }
          img.logo { 
            max-width: 150px; 
            margin-bottom: 10px; 
          }
          a { 
            color: {{primaryColor}}; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="{{logoUrl}}" alt="Logo" class="logo">
            <h1>{{title}}</h1>
          </div>
          <div class="content">
            {{content}}
          </div>
          <div class="footer">
            <p>{{footerText}}</p>
            <p>© {{year}} IPA Las Encinas. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    previewImage: "",
    editableFields: [
      {
        name: "title",
        type: "text",
        label: "Título",
        defaultValue: "Novedades de IPA Las Encinas",
        placeholder: "Ingrese el título del email",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL de la imagen del logo",
      },
      {
        name: "content",
        type: "textarea",
        label: "Contenido",
        defaultValue:
          "<p>Hola,</p><p>Gracias por suscribirte a nuestro newsletter. Aquí encontrarás las últimas novedades de IPA Las Encinas.</p><p>Saludos cordiales,<br>El equipo de IPA Las Encinas</p>",
        placeholder: "Contenido principal del email",
      },
      {
        name: "primaryColor",
        type: "color",
        label: "Color Principal",
        defaultValue: "#3b82f6",
      },
      {
        name: "textColor",
        type: "color",
        label: "Color de Texto",
        defaultValue: "#333333",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie de Página",
        defaultValue: "Si no deseas recibir más emails, puedes darte de baja aquí.",
      },
      {
        name: "year",
        type: "text",
        label: "Año",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
  {
    name: "Anuncio de Evento",
    description: "Plantilla para anunciar eventos especiales",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{eventName}} - IPA Las Encinas</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f9f9f9; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
          }
          .header { 
            background-color: {{themeColor}}; 
            padding: 30px 20px; 
            text-align: center; 
            color: white; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
          }
          .event-image { 
            width: 100%; 
            height: auto; 
            display: block; 
          }
          .content { 
            padding: 30px 20px; 
          }
          .event-details { 
            background-color: #f5f5f5; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0; 
          }
          .event-details p { 
            margin: 8px 0; 
          }
          .cta-button { 
            display: block; 
            background-color: {{themeColor}}; 
            color: white; 
            text-decoration: none; 
            text-align: center; 
            padding: 15px 20px; 
            border-radius: 4px; 
            font-weight: bold; 
            margin: 25px auto; 
            width: 200px; 
          }
          .footer { 
            background-color: #f4f4f4; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{eventName}}</h1>
            <p>{{eventTagline}}</p>
          </div>
          
          <img src="{{eventImageUrl}}" alt="{{eventName}}" class="event-image">
          
          <div class="content">
            <h2>Te invitamos a nuestro evento</h2>
            
            {{eventDescription}}
            
            <div class="event-details">
              <p><strong>Fecha:</strong> {{eventDate}}</p>
              <p><strong>Hora:</strong> {{eventTime}}</p>
              <p><strong>Lugar:</strong> {{eventLocation}}</p>
            </div>
            
            <a href="{{eventUrl}}" class="cta-button">REGISTRARSE</a>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
          
          <div class="footer">
            <p>© {{year}} IPA Las Encinas. Todos los derechos reservados.</p>
            <p>{{footerText}}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    previewImage: "",
    editableFields: [
      {
        name: "eventName",
        type: "text",
        label: "Nombre del Evento",
        defaultValue: "Degustación de Vinos",
        placeholder: "Nombre del evento",
      },
      {
        name: "eventTagline",
        type: "text",
        label: "Eslogan del Evento",
        defaultValue: "Una experiencia única para los amantes del vino",
        placeholder: "Breve descripción del evento",
      },
      {
        name: "eventImageUrl",
        type: "image",
        label: "Imagen del Evento",
        defaultValue: "",
        placeholder: "URL de la imagen del evento",
      },
      {
        name: "eventDescription",
        type: "textarea",
        label: "Descripción del Evento",
        defaultValue:
          "<p>Nos complace invitarte a nuestra exclusiva degustación de vinos donde podrás disfrutar de las mejores cosechas de nuestra bodega.</p><p>El evento incluirá:</p><ul><li>Degustación de 5 vinos premium</li><li>Maridaje con productos locales</li><li>Visita guiada a nuestras instalaciones</li></ul>",
        placeholder: "Descripción detallada del evento",
      },
      {
        name: "eventDate",
        type: "text",
        label: "Fecha del Evento",
        defaultValue: "15 de Junio de 2025",
      },
      {
        name: "eventTime",
        type: "text",
        label: "Hora del Evento",
        defaultValue: "19:00 - 22:00",
      },
      {
        name: "eventLocation",
        type: "text",
        label: "Lugar del Evento",
        defaultValue: "Bodega IPA Las Encinas, Carretera Principal Km 5",
      },
      {
        name: "eventUrl",
        type: "text",
        label: "URL de Registro",
        defaultValue: "",
      },
      {
        name: "themeColor",
        type: "color",
        label: "Color Temático",
        defaultValue: "#8e44ad",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie de Página",
        defaultValue: "Si no deseas recibir más invitaciones, puedes darte de baja aquí.",
      },
      {
        name: "year",
        type: "text",
        label: "Año",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
  {
    name: "Promoción Especial",
    description: "Plantilla para anunciar promociones y ofertas especiales",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{promoTitle}} - IPA Las Encinas</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f0f0f0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
          }
          .header { 
            text-align: center; 
            padding: 20px; 
          }
          .logo { 
            max-width: 150px; 
            margin-bottom: 10px; 
          }
          .banner { 
            width: 100%; 
            height: auto; 
            display: block; 
          }
          .promo-header { 
            background-color: {{accentColor}}; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            font-size: 24px; 
            font-weight: bold; 
          }
          .content { 
            padding: 20px; 
          }
          .offer-box { 
            border: 3px dashed {{accentColor}}; 
            padding: 20px; 
            text-align: center; 
            margin: 20px 0; 
            background-color: #fff9e6; 
          }
          .offer-code { 
            font-size: 28px; 
            font-weight: bold; 
            color: {{accentColor}}; 
            letter-spacing: 2px; 
            margin: 10px 0; 
          }
          .cta-button { 
            display: block; 
            background-color: {{accentColor}}; 
            color: white; 
            text-decoration: none; 
            text-align: center; 
            padding: 15px 20px; 
            border-radius: 4px; 
            font-weight: bold; 
            margin: 25px auto; 
            width: 200px; 
          }
          .terms { 
            font-size: 12px; 
            color: #666; 
            margin-top: 20px; 
          }
          .footer { 
            background-color: #f4f4f4; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="{{logoUrl}}" alt="IPA Las Encinas" class="logo">
          </div>
          
          <div class="promo-header">
            {{promoTitle}}
          </div>
          
          <img src="{{bannerUrl}}" alt="{{promoTitle}}" class="banner">
          
          <div class="content">
            <h2>{{promoHeadline}}</h2>
            
            {{promoDescription}}
            
            <div class="offer-box">
              <p>Usa este código para obtener tu descuento:</p>
              <div class="offer-code">{{promoCode}}</div>
              <p>Válido hasta: {{expiryDate}}</p>
            </div>
            
            <a href="{{promoUrl}}" class="cta-button">APROVECHAR OFERTA</a>
            
            <div class="terms">
              {{termsAndConditions}}
            </div>
          </div>
          
          <div class="footer">
            <p>© {{year}} IPA Las Encinas. Todos los derechos reservados.</p>
            <p>{{footerText}}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    previewImage: "",
    editableFields: [
      {
        name: "promoTitle",
        type: "text",
        label: "Título de la Promoción",
        defaultValue: "¡OFERTA ESPECIAL!",
        placeholder: "Título principal de la promoción",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL de la imagen del logo",
      },
      {
        name: "bannerUrl",
        type: "image",
        label: "Imagen de Banner",
        defaultValue: "",
        placeholder: "URL de la imagen del banner",
      },
      {
        name: "promoHeadline",
        type: "text",
        label: "Titular de la Promoción",
        defaultValue: "Descuento exclusivo para nuestros suscriptores",
        placeholder: "Titular atractivo para la promoción",
      },
      {
        name: "promoDescription",
        type: "textarea",
        label: "Descripción de la Promoción",
        defaultValue:
          "<p>Queremos agradecerte por ser parte de nuestra comunidad con esta oferta exclusiva:</p><p><strong>20% de descuento en todos nuestros vinos premium</strong> para compras realizadas online o en nuestra tienda física.</p>",
        placeholder: "Descripción detallada de la promoción",
      },
      {
        name: "promoCode",
        type: "text",
        label: "Código Promocional",
        defaultValue: "ENCINAS20",
      },
      {
        name: "expiryDate",
        type: "text",
        label: "Fecha de Expiración",
        defaultValue: "31 de Diciembre de 2025",
      },
      {
        name: "promoUrl",
        type: "text",
        label: "URL de la Promoción",
        defaultValue: "https://ipa-las-encinas.netlify.app/",
      },
      {
        name: "accentColor",
        type: "color",
        label: "Color de Acento",
        defaultValue: "#e74c3c",
      },
      {
        name: "termsAndConditions",
        type: "textarea",
        label: "Términos y Condiciones",
        defaultValue:
          "* Oferta válida hasta la fecha indicada. No acumulable con otras promociones. El descuento se aplica al precio regular. Sujeto a disponibilidad de stock.",
        placeholder: "Términos y condiciones de la promoción",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie de Página",
        defaultValue: "Si no deseas recibir más promociones, puedes darte de baja aquí.",
      },
      {
        name: "year",
        type: "text",
        label: "Año",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
]

export async function POST() {
  try {
    await connectToDatabase()

    // Verificar si ya existen plantillas
    const existingCount = await EmailTemplate.countDocuments()

    if (existingCount > 0) {
      return NextResponse.json({
        message: "Las plantillas ya están inicializadas",
        count: existingCount,
      })
    }

    // Insertar plantillas predeterminadas
    const result = await EmailTemplate.insertMany(defaultTemplates)

    return NextResponse.json({
      message: "Plantillas inicializadas correctamente",
      count: result.length,
    })
  } catch (error) {
    console.error("Error al inicializar plantillas:", error)
    return NextResponse.json({ error: "Error al inicializar plantillas" }, { status: 500 })
  }
}

