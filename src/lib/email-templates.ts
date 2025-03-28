import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"

// Función para aplicar valores a una plantilla
export function applyTemplateValues(htmlTemplate: string, values: Record<string, string | boolean>): string {
  let result = htmlTemplate

  // Reemplazar todas las variables en el formato {{variable}}
  Object.entries(values).forEach(([key, value]) => {
    // Manejar bloques condicionales para elementos opcionales
    if (typeof value === "boolean") {
      const conditionalRegex = new RegExp(`<!--IF:${key}-->[\\s\\S]*?<!--ENDIF:${key}-->`, "g")

      if (value) {
        // Si es true, mantener el contenido pero eliminar las etiquetas condicionales
        result = result.replace(new RegExp(`<!--IF:${key}-->([\\s\\S]*?)<!--ENDIF:${key}-->`, "g"), "$1")
      } else {
        // Si es false, eliminar todo el bloque condicional
        result = result.replace(conditionalRegex, "")
      }
    } else {
      // Reemplazar variables normales
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, String(value))
    }
  })

  return result
}

// Definir la interfaz EditableField
interface EditableField {
  name: string
  type: string
  label: string
  defaultValue: string
  placeholder?: string
  optional?: boolean
  group?: string
}

// Función para aplicar valores a una plantilla
export function applyTemplateValuesSimple(htmlTemplate: string, values: Record<string, string>): string {
  let result = htmlTemplate

  // Reemplazar todas las variables en el formato {{variable}}
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    result = result.replace(regex, value)
  })

  return result
}

// Definir interfaces para los tipos
export interface EmailTemplateData {
  name: string
  description: string
  htmlContent: string
  previewImage?: string
  editableFields: EditableField[]
  type?: "newsletter" | "welcome" | "notification" | "other"
}

// Plantillas predefinidas para inicializar la base de datos
export const defaultTemplates: EmailTemplateData[] = [
  {
    name: "Anuncio Simple",
    description: "Plantilla básica para anuncios y comunicados generales",
    type: "newsletter",
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
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header { 
            background-color: {{headerColor}}; 
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
            background-color: {{buttonColor}};
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <!--IF:showLogo-->
          <img src="{{logoUrl}}" alt="Logo" class="logo">
          <!--ENDIF:showLogo-->
          <h1>{{title}}</h1>
        </div>
        <div class="content">
          <p>{{greeting}}</p>
          <p>{{mainContent}}</p>
          <p>{{callToAction}}</p>
          <a href="{{buttonUrl}}" class="button">{{buttonText}}</a>
        </div>
        <div class="footer">
          <p>{{footerText}}</p>
          <p>© {{currentYear}} IPA Las Encinas. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    previewImage: "/placeholder.svg?height=300&width=400",
    editableFields: [
      {
        name: "title",
        type: "text",
        label: "Título",
        defaultValue: "Anuncio Importante",
        placeholder: "Ingrese el título del email",
      },
      {
        name: "headerColor",
        type: "color",
        label: "Color de Cabecera",
        defaultValue: "#4f46e5",
      },
      {
        name: "showLogo",
        type: "boolean",
        label: "Mostrar Logo",
        defaultValue: "true",
        group: "Imagen",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL de la imagen del logo",
        group: "Imagen",
      },
      {
        name: "greeting",
        type: "text",
        label: "Saludo",
        defaultValue: "Estimados miembros de la comunidad:",
        placeholder: "Saludo inicial",
      },
      {
        name: "mainContent",
        type: "textarea",
        label: "Contenido Principal",
        defaultValue:
          "Nos complace informarles sobre las próximas actividades que tendremos en nuestra institución. Hemos preparado una serie de eventos que serán de gran interés para todos.",
        placeholder: "Contenido principal del mensaje",
      },
      {
        name: "callToAction",
        type: "textarea",
        label: "Llamado a la Acción",
        defaultValue:
          "¡No pierda la oportunidad de participar en estas actividades! Haga clic en el botón a continuación para más información.",
        placeholder: "Texto que invita a realizar una acción",
      },
      {
        name: "buttonText",
        type: "text",
        label: "Texto del Botón",
        defaultValue: "Más Información",
        placeholder: "Texto que aparecerá en el botón",
      },
      {
        name: "buttonUrl",
        type: "text",
        label: "URL del Botón",
        defaultValue: "https://www.ipalasencinas.com",
        placeholder: "URL a la que dirigirá el botón",
      },
      {
        name: "buttonColor",
        type: "color",
        label: "Color del Botón",
        defaultValue: "#4f46e5",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie",
        defaultValue: "Si no desea recibir más correos, puede darse de baja haciendo clic aquí.",
        placeholder: "Texto que aparecerá en el pie de página",
      },
      {
        name: "currentYear",
        type: "text",
        label: "Año Actual",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
  {
    name: "Boletín Informativo",
    description: "Plantilla para boletines con múltiples secciones de noticias",
    type: "newsletter",
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
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header { 
            background-color: {{headerColor}}; 
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 5px 5px 0 0;
          }
          .content { 
            padding: 20px;
            background-color: white;
            border: 1px solid #ddd;
          }
          .news-item {
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
          }
          .news-item:last-child {
            border-bottom: none;
          }
          .news-title {
            color: {{accentColor}};
            margin-bottom: 5px;
          }
          .footer { 
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
            background-color: #f5f5f5;
            border-radius: 0 0 5px 5px;
          }
          img.logo { 
            max-width: 150px;
            margin-bottom: 10px;
          }
          .social-links {
            margin-top: 15px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 5px;
            color: {{accentColor}};
            text-decoration: none;
          }
          .date {
            font-style: italic;
            color: #888;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .header-image {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <!--IF:showHeaderImage-->
          <img src="{{headerImage}}" alt="Cabecera" class="header-image">
          <!--ENDIF:showHeaderImage-->
          <!--IF:showLogo-->
          <img src="{{logoUrl}}" alt="Logo" class="logo">
          <!--ENDIF:showLogo-->
          <h1>{{title}}</h1>
          <p class="date">{{date}}</p>
        </div>
        <div class="content">
          <p>{{greeting}}</p>
          
          <div class="news-item">
            <h2 class="news-title">{{newsTitle1}}</h2>
            <p>{{newsContent1}}</p>
          </div>
          
          <div class="news-item">
            <h2 class="news-title">{{newsTitle2}}</h2>
            <p>{{newsContent2}}</p>
          </div>
          
          <div class="news-item">
            <h2 class="news-title">{{newsTitle3}}</h2>
            <p>{{newsContent3}}</p>
          </div>
          
          <p>{{closingMessage}}</p>
        </div>
        <div class="footer">
          <p>{{footerText}}</p>
          <div class="social-links">
            <a href="{{facebookUrl}}">Facebook</a> | 
            <a href="{{instagramUrl}}">Instagram</a> | 
            <a href="{{websiteUrl}}">Sitio Web</a>
          </div>
          <p>© {{currentYear}} IPA Las Encinas. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    previewImage: "/placeholder.svg?height=300&width=400",
    editableFields: [
      {
        name: "title",
        type: "text",
        label: "Título del Boletín",
        defaultValue: "Boletín Informativo - IPA Las Encinas",
        placeholder: "Ingrese el título del boletín",
      },
      {
        name: "headerColor",
        type: "color",
        label: "Color de Cabecera",
        defaultValue: "#2563eb",
      },
      {
        name: "showHeaderImage",
        type: "boolean",
        label: "Mostrar Imagen de Cabecera",
        defaultValue: "false",
        group: "Imágenes",
      },
      {
        name: "headerImage",
        type: "image",
        label: "Imagen de Cabecera",
        defaultValue: "",
        placeholder: "URL de la imagen de cabecera",
        group: "Imágenes",
      },
      {
        name: "showLogo",
        type: "boolean",
        label: "Mostrar Logo",
        defaultValue: "true",
        group: "Imágenes",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL de la imagen del logo",
        group: "Imágenes",
      },
      {
        name: "accentColor",
        type: "color",
        label: "Color de Acento",
        defaultValue: "#2563eb",
      },
      {
        name: "date",
        type: "text",
        label: "Fecha",
        defaultValue: new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }),
        placeholder: "Fecha del boletín",
      },
      {
        name: "greeting",
        type: "text",
        label: "Saludo",
        defaultValue: "Estimada comunidad educativa:",
        placeholder: "Saludo inicial",
      },
      {
        name: "newsTitle1",
        type: "text",
        label: "Título Noticia 1",
        defaultValue: "Próximos Eventos",
        placeholder: "Título de la primera noticia",
      },
      {
        name: "newsContent1",
        type: "textarea",
        label: "Contenido Noticia 1",
        defaultValue:
          "Tenemos el agrado de informarles sobre los próximos eventos que se realizarán en nuestra institución. Marque estas fechas en su calendario para no perderse ninguna actividad importante.",
        placeholder: "Contenido de la primera noticia",
      },
      {
        name: "newsTitle2",
        type: "text",
        label: "Título Noticia 2",
        defaultValue: "Logros Académicos",
        placeholder: "Título de la segunda noticia",
      },
      {
        name: "newsContent2",
        type: "textarea",
        label: "Contenido Noticia 2",
        defaultValue:
          "Nos complace anunciar los destacados logros académicos de nuestros estudiantes en el último trimestre. Felicitamos a todos por su dedicación y esfuerzo.",
        placeholder: "Contenido de la segunda noticia",
      },
      {
        name: "newsTitle3",
        type: "text",
        label: "Título Noticia 3",
        defaultValue: "Información Importante",
        placeholder: "Título de la tercera noticia",
      },
      {
        name: "newsContent3",
        type: "textarea",
        label: "Contenido Noticia 3",
        defaultValue:
          "Queremos recordarles algunas fechas importantes y procedimientos que deben tener en cuenta para el próximo período escolar.",
        placeholder: "Contenido de la tercera noticia",
      },
      {
        name: "closingMessage",
        type: "textarea",
        label: "Mensaje de Cierre",
        defaultValue:
          "Agradecemos su continuo apoyo y participación en nuestra comunidad educativa. Juntos seguimos construyendo un mejor futuro para nuestros estudiantes.",
        placeholder: "Mensaje de cierre del boletín",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie",
        defaultValue: "Si no desea recibir más correos, puede darse de baja haciendo clic aquí.",
        placeholder: "Texto que aparecerá en el pie de página",
      },
      {
        name: "facebookUrl",
        type: "text",
        label: "URL de Facebook",
        defaultValue: "https://www.facebook.com/ipalasencinas",
        placeholder: "URL de la página de Facebook",
      },
      {
        name: "instagramUrl",
        type: "text",
        label: "URL de Instagram",
        defaultValue: "https://www.instagram.com/ipalasencinas",
        placeholder: "URL de la cuenta de Instagram",
      },
      {
        name: "websiteUrl",
        type: "text",
        label: "URL del Sitio Web",
        defaultValue: "https://www.ipalasencinas.com",
        placeholder: "URL del sitio web",
      },
      {
        name: "currentYear",
        type: "text",
        label: "Año Actual",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
  {
    name: "Invitación a Evento",
    description: "Plantilla para invitaciones a eventos especiales",
    type: "newsletter",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{title}}</title>
        <style>
          body { 
            font-family: 'Helvetica', Arial, sans-serif; 
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            background-color: {{headerColor}}; 
            padding: 30px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
          }
          .content { 
            padding: 30px 20px;
            text-align: center;
          }
          .event-details {
            margin: 25px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 6px;
          }
          .event-details p {
            margin: 5px 0;
          }
          .event-image {
            width: 100%;
            max-height: 250px;
            object-fit: cover;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: {{buttonColor}};
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .button:hover {
            background-color: {{buttonHoverColor}};
          }
          .footer { 
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            background-color: #f5f5f5;
          }
          .divider {
            height: 1px;
            background-color: #eee;
            margin: 20px 0;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!--IF:showLogo-->
            <img src="{{logoUrl}}" alt="Logo" class="logo">
            <!--ENDIF:showLogo-->
            <h1>{{title}}</h1>
          </div>
          
          <div class="content">
            <!--IF:showEventImage-->
            <img src="{{eventImage}}" alt="Evento" class="event-image">
            <!--ENDIF:showEventImage-->
            
            <h2>{{subtitle}}</h2>
            <p>{{greeting}}</p>
            
            <p>{{invitationText}}</p>
            
            <div class="event-details">
              <p><strong>Fecha:</strong> {{eventDate}}</p>
              <p><strong>Hora:</strong> {{eventTime}}</p>
              <p><strong>Lugar:</strong> {{eventLocation}}</p>
            </div>
            
            <p>{{additionalInfo}}</p>
            
            <a href="{{buttonUrl}}" class="button">{{buttonText}}</a>
            
            <div class="divider"></div>
            
            <p>{{closingMessage}}</p>
          </div>
          
          <div class="footer">
            <p>{{footerText}}</p>
            <p>© {{currentYear}} IPA Las Encinas. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    previewImage: "/placeholder.svg?height=300&width=400",
    editableFields: [
      {
        name: "title",
        type: "text",
        label: "Título",
        defaultValue: "¡Estás Invitado!",
        placeholder: "Título de la invitación",
      },
      {
        name: "headerColor",
        type: "color",
        label: "Color de Cabecera",
        defaultValue: "#8b5cf6",
      },
      {
        name: "showLogo",
        type: "boolean",
        label: "Mostrar Logo",
        defaultValue: "true",
        group: "Imágenes",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL del logo",
        group: "Imágenes",
      },
      {
        name: "showEventImage",
        type: "boolean",
        label: "Mostrar Imagen del Evento",
        defaultValue: "true",
        group: "Imágenes",
      },
      {
        name: "eventImage",
        type: "image",
        label: "Imagen del Evento",
        defaultValue: "/placeholder.svg?height=250&width=600",
        placeholder: "URL de la imagen del evento",
        group: "Imágenes",
      },
      {
        name: "subtitle",
        type: "text",
        label: "Subtítulo",
        defaultValue: "Ceremonia de Graduación 2023",
        placeholder: "Subtítulo o nombre del evento",
      },
      {
        name: "greeting",
        type: "text",
        label: "Saludo",
        defaultValue: "Estimados padres y apoderados:",
        placeholder: "Saludo inicial",
      },
      {
        name: "invitationText",
        type: "textarea",
        label: "Texto de Invitación",
        defaultValue:
          "Tenemos el honor de invitarle a la Ceremonia de Graduación de nuestros estudiantes. Este evento marca un hito importante en la vida académica de nuestros alumnos y nos gustaría compartir este momento especial con usted.",
        placeholder: "Texto principal de la invitación",
      },
      {
        name: "eventDate",
        type: "text",
        label: "Fecha del Evento",
        defaultValue: "15 de Diciembre de 2023",
        placeholder: "Fecha en que se realizará el evento",
      },
      {
        name: "eventTime",
        type: "text",
        label: "Hora del Evento",
        defaultValue: "19:00 horas",
        placeholder: "Hora en que se realizará el evento",
      },
      {
        name: "eventLocation",
        type: "text",
        label: "Lugar del Evento",
        defaultValue: "Auditorio Principal, IPA Las Encinas",
        placeholder: "Ubicación donde se realizará el evento",
      },
      {
        name: "additionalInfo",
        type: "textarea",
        label: "Información Adicional",
        defaultValue:
          "Se solicita puntualidad. El evento comenzará a la hora señalada. Se dispondrá de estacionamiento para los asistentes.",
        placeholder: "Información adicional relevante",
      },
      {
        name: "buttonText",
        type: "text",
        label: "Texto del Botón",
        defaultValue: "Confirmar Asistencia",
        placeholder: "Texto que aparecerá en el botón",
      },
      {
        name: "buttonUrl",
        type: "text",
        label: "URL del Botón",
        defaultValue: "https://www.ipalasencinas.com/confirmar",
        placeholder: "URL a la que dirigirá el botón",
      },
      {
        name: "buttonColor",
        type: "color",
        label: "Color del Botón",
        defaultValue: "#8b5cf6",
      },
      {
        name: "buttonHoverColor",
        type: "color",
        label: "Color del Botón (Hover)",
        defaultValue: "#7c3aed",
      },
      {
        name: "closingMessage",
        type: "textarea",
        label: "Mensaje de Cierre",
        defaultValue: "Esperamos contar con su presencia en este día tan especial para nuestra comunidad educativa.",
        placeholder: "Mensaje de cierre de la invitación",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie",
        defaultValue: "Este correo fue enviado porque usted es parte de nuestra comunidad educativa.",
        placeholder: "Texto que aparecerá en el pie de página",
      },
      {
        name: "currentYear",
        type: "text",
        label: "Año Actual",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
  {
    name: "Bienvenida a Suscriptores",
    description: "Plantilla para dar la bienvenida a nuevos suscriptores",
    type: "welcome",
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
            background-color: {{headerColor}}; 
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
            background-color: {{buttonColor}};
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <!--IF:showLogo-->
          <img src="{{logoUrl}}" alt="Logo" class="logo">
          <!--ENDIF:showLogo-->
          <h1>¡Bienvenido a nuestra comunidad!</h1>
        </div>
        <div class="content">
          <p>{{greeting}}</p>
          <p>{{welcomeMessage}}</p>
          <p>{{benefitsMessage}}</p>
          <a href="{{websiteUrl}}" class="button">{{buttonText}}</a>
        </div>
        <div class="footer">
          <p>{{footerText}}</p>
          <p>© {{currentYear}} IPA Las Encinas. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    previewImage: "",
    editableFields: [
      {
        name: "headerColor",
        type: "color",
        label: "Color de Cabecera",
        defaultValue: "#4f46e5",
      },
      {
        name: "showLogo",
        type: "boolean",
        label: "Mostrar Logo",
        defaultValue: "true",
        group: "Imagen",
      },
      {
        name: "logoUrl",
        type: "image",
        label: "URL del Logo",
        defaultValue: "",
        placeholder: "URL del logo",
        group: "Imagen",
      },
      {
        name: "greeting",
        type: "text",
        label: "Saludo",
        defaultValue: "Estimado(a) suscriptor(a):",
        placeholder: "Saludo inicial",
      },
      {
        name: "welcomeMessage",
        type: "textarea",
        label: "Mensaje de Bienvenida",
        defaultValue:
          "Gracias por suscribirte a nuestro boletín informativo. Estamos muy contentos de tenerte como parte de nuestra comunidad.",
        placeholder: "Mensaje principal de bienvenida",
      },
      {
        name: "benefitsMessage",
        type: "textarea",
        label: "Beneficios",
        defaultValue:
          "A partir de ahora, recibirás actualizaciones sobre nuestras actividades, eventos especiales y noticias importantes de nuestra iglesia.",
        placeholder: "Descripción de beneficios",
      },
      {
        name: "buttonText",
        type: "text",
        label: "Texto del Botón",
        defaultValue: "Visitar Nuestro Sitio",
        placeholder: "Texto que aparecerá en el botón",
      },
      {
        name: "buttonColor",
        type: "color",
        label: "Color del Botón",
        defaultValue: "#4f46e5",
      },
      {
        name: "websiteUrl",
        type: "text",
        label: "URL del Sitio Web",
        defaultValue: "https://ipa-las-encinas.netlify.app/",
        placeholder: "URL del sitio web",
      },
      {
        name: "footerText",
        type: "text",
        label: "Texto del Pie",
        defaultValue: "Si no desea recibir más correos, puede darse de baja haciendo clic aquí.",
        placeholder: "Texto que aparecerá en el pie de página",
      },
      {
        name: "currentYear",
        type: "text",
        label: "Año Actual",
        defaultValue: new Date().getFullYear().toString(),
      },
    ],
  },
]

// Función para inicializar las plantillas predeterminadas en la base de datos
export async function initializeDefaultTemplates() {
  try {
    await connectToDatabase()

    // Verificar si ya existen plantillas
    const count = await EmailTemplate.countDocuments()

    // Si no hay plantillas, insertar las predeterminadas
    if (count === 0) {
      await EmailTemplate.insertMany(defaultTemplates)
      console.log("Plantillas de email predeterminadas inicializadas correctamente")
    }

    return { success: true }
  } catch (error) {
    console.error("Error al inicializar plantillas predeterminadas:", error)
    return { success: false, error }
  }
}

// Función para obtener una vista previa de una plantilla con valores personalizados
export function getTemplatePreview(template: EmailTemplateData, values: Record<string, string>) {
  // Asegurarse de que todos los campos editables tengan un valor
  const completeValues: Record<string, string | boolean> = {}

  // Primero, establecer los valores predeterminados
  if (template.editableFields) {
    template.editableFields.forEach((field: EditableField) => {
      if (field.type === "boolean") {
        completeValues[field.name] = field.defaultValue === "true"
      } else {
        completeValues[field.name] = field.defaultValue || ""
      }
    })
  }

  // Luego, sobrescribir con los valores proporcionados
  Object.entries(values).forEach(([key, value]) => {
    if (key.startsWith("show") && (value === "true" || value === "false")) {
      completeValues[key] = value === "true"
    } else {
      completeValues[key] = value
    }
  })

  // Aplicar los valores a la plantilla
  return applyTemplateValues(template.htmlContent, completeValues)
}

export async function getEmailTemplates() {
  try {
    await connectToDatabase()
    return await EmailTemplate.find({}).sort({ name: 1 })
  } catch (error) {
    console.error("Error al obtener plantillas de email:", error)
    throw error
  }
}

export async function getEmailTemplateById(id: string) {
  try {
    await connectToDatabase()
    return await EmailTemplate.findById(id)
  } catch (error) {
    console.error(`Error al obtener plantilla de email con ID ${id}:`, error)
    throw error
  }
}

export async function getWelcomeTemplate() {
  try {
    await connectToDatabase()

    // Buscar plantilla de bienvenida existente
    let welcomeTemplate = await EmailTemplate.findOne({ type: "welcome" })

    // Si no existe, crear una predeterminada
    if (!welcomeTemplate) {
      const welcomeTemplateData = defaultTemplates.find((t) => t.type === "welcome")
      if (welcomeTemplateData) {
        welcomeTemplate = await EmailTemplate.create(welcomeTemplateData)
        console.log("Plantilla de bienvenida creada automáticamente")
      }
    }

    return welcomeTemplate
  } catch (error) {
    console.error("Error al obtener plantilla de bienvenida:", error)
    throw error
  }
}

export async function createEmailTemplate(data: EmailTemplateData) {
  try {
    await connectToDatabase()
    const template = new EmailTemplate(data)
    await template.save()
    return template
  } catch (error) {
    console.error("Error al crear plantilla de email:", error)
    throw error
  }
}

export async function updateEmailTemplate(id: string, data: Partial<EmailTemplateData>) {
  try {
    await connectToDatabase()
    return await EmailTemplate.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
  } catch (error) {
    console.error(`Error al actualizar plantilla de email con ID ${id}:`, error)
    throw error
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    await connectToDatabase()

    // Verificar si es la plantilla de bienvenida
    const template = await EmailTemplate.findById(id)
    if (template && template.type === "welcome") {
      throw new Error("No se puede eliminar la plantilla de bienvenida")
    }

    return await EmailTemplate.findByIdAndDelete(id)
  } catch (error) {
    console.error(`Error al eliminar plantilla de email con ID ${id}:`, error)
    throw error
  }
}

