import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"

// GET - Obtener todas las plantillas
export async function GET() {
  try {
    await connectToDatabase()

    const templates = await EmailTemplate.find({}).sort({ createdAt: -1 })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error al obtener plantillas de email:", error)
    return NextResponse.json({ error: "Error al obtener plantillas de email" }, { status: 500 })
  }
}

// POST - Crear una nueva plantilla
export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()

    const newTemplate = new EmailTemplate(data)
    await newTemplate.save()


    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error) {
    console.error("Error al crear plantilla de email:", error)
    return NextResponse.json({ error: "Error al crear plantilla de email" }, { status: 500 })
  }
}

