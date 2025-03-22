import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import EmailTemplate, { IEmailTemplate } from "@/models/EmailTemplate";
import mongoose from "mongoose";

interface Params {
  params: {
    id: string;
  };
}

// GET - Obtener una plantilla específica
export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<IEmailTemplate | { error: string }>> {
  try {
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de plantilla inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const template = await EmailTemplate.findById(id);

    if (!template) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error al obtener plantilla de email:", error);
    return NextResponse.json(
      { error: "Error al obtener plantilla de email" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una plantilla
export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<IEmailTemplate | { error: string }>> {
  try {
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de plantilla inválido" }, { status: 400 });
    }

    const data = await request.json();
    await connectToDatabase();

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error al actualizar plantilla de email:", error);
    return NextResponse.json(
      { error: "Error al actualizar plantilla de email" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una plantilla
export async function DELETE(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de plantilla inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar plantilla de email:", error);
    return NextResponse.json(
      { error: "Error al eliminar plantilla de email" },
      { status: 500 }
    );
  }
}