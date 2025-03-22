import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import EmailTemplate from "@/models/EmailTemplate";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

// GET - Obtener una plantilla específica
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return new Response(
        JSON.stringify({ error: "ID de plantilla inválido" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDatabase();
    const template = await EmailTemplate.findById(id);

    if (!template) {
      return new Response(
        JSON.stringify({ error: "Plantilla no encontrada" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(template),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error al obtener plantilla de email:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener plantilla de email" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT - Actualizar una plantilla
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return new Response(
        JSON.stringify({ error: "ID de plantilla inválido" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    await connectToDatabase();

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return new Response(
        JSON.stringify({ error: "Plantilla no encontrada" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(updatedTemplate),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error al actualizar plantilla de email:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar plantilla de email" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE - Eliminar una plantilla
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!mongoose.isValidObjectId(id)) {
      return new Response(
        JSON.stringify({ error: "ID de plantilla inválido" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDatabase();
    const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return new Response(
        JSON.stringify({ error: "Plantilla no encontrada" }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error al eliminar plantilla de email:", error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar plantilla de email" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}