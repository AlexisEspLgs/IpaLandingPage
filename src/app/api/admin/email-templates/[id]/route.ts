import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import EmailTemplate from "@/models/EmailTemplate"

// GET - Obtener una plantilla específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("id (params):", id) // Log del id
    console.log("typeof id:", typeof id) // Verificando el tipo de id
    
    await connectToDatabase()

    const template = await EmailTemplate.findById(id)
    console.log("template (GET):", template) // Log de la plantilla obtenida
    console.log("typeof template:", typeof template) // Verificando tipo de template

    if (!template) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error al obtener plantilla de email:", error)
    return NextResponse.json({ error: "Error al obtener plantilla de email" }, { status: 500 })
  }
}

// PUT - Actualizar una plantilla
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("id (params):", id) // Log del id
    console.log("typeof id:", typeof id) // Verificando el tipo de id

    const data = await request.json()
    console.log("data (PUT):", data) // Log de los datos recibidos
    console.log("typeof data:", typeof data) // Verificando tipo de data

    await connectToDatabase()

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    console.log("updatedTemplate (PUT):", updatedTemplate) // Log de la plantilla actualizada
    console.log("typeof updatedTemplate:", typeof updatedTemplate) // Verificando tipo de updatedTemplate

    if (!updatedTemplate) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("Error al actualizar plantilla de email:", error)
    return NextResponse.json({ error: "Error al actualizar plantilla de email" }, { status: 500 })
  }
}

// DELETE - Eliminar una plantilla
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log("id (params):", id) // Log del id
    console.log("typeof id:", typeof id) // Verificando el tipo de id

    await connectToDatabase()

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(id)
    console.log("deletedTemplate (DELETE):", deletedTemplate) // Log de la plantilla eliminada
    console.log("typeof deletedTemplate:", typeof deletedTemplate) // Verificando tipo de deletedTemplate

    if (!deletedTemplate) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar plantilla de email:", error)
    return NextResponse.json({ error: "Error al eliminar plantilla de email" }, { status: 500 })
  }
}
