import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { v2 as cloudinary } from "cloudinary"

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database")
    }
    const config = await db.collection("config").findOne<{ data: { images: { _id?: string | object; url?: string }[] } }>({ name: "ipalee" })
    return NextResponse.json({ success: true, config: config?.data || { images: [] } })
  } catch (error) {
    console.error("Error fetching ipalee config:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database")
    }
    const data = await request.json()
    await db.collection("config").updateOne({ name: "ipalee" }, { $set: { data } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving ipalee config:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database")
    }

    // Obtener el ID de la imagen a eliminar
    const { imageId } = await request.json()
    if (!imageId) {
      return NextResponse.json({ success: false, message: "ID de imagen no proporcionado" }, { status: 400 })
    }

    // Obtener la configuración actual
    const config = await db.collection("config").findOne({ name: "ipalee" })
    if (!config || !config.data || !config.data.images) {
      return NextResponse.json({ success: false, message: "Configuración no encontrada" }, { status: 404 })
    }
    // Encontrar la imagen a eliminar
    const imageToDelete = config.data.images.find((img: { id?: string | object; url?: string }) => {
      if (!img.id) return false

      // Convertir a string para comparación
      const imgId = typeof img.id === "object" ? img.id.toString() : img.id
      const targetId = typeof imageId === "object" ? imageId.toString() : imageId
      return imgId === targetId
    })

    if (!imageToDelete) {
      return NextResponse.json({ success: false, message: "Imagen no encontrada" }, { status: 404 })
    }
    // Eliminar la imagen de Cloudinary si tiene una URL de Cloudinary
    if (imageToDelete.url && imageToDelete.url.includes("cloudinary")) {
      try {
        // Extraer el public_id de la URL de Cloudinary
        const urlParts = imageToDelete.url.split("/")
        const filenameWithExtension = urlParts[urlParts.length - 1]
        const publicId = filenameWithExtension.split(".")[0]

        // Eliminar la imagen de Cloudinary
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId)
        console.log(`Resultado de Cloudinary: ${JSON.stringify(cloudinaryResult)}`)
      } catch (cloudinaryError) {
        console.error("Error al eliminar la imagen de Cloudinary:", cloudinaryError)
        // Continuamos con la eliminación de la BD incluso si falla Cloudinary
      }
    }

    // Filtrar la imagen del array de imágenes
    const updatedImages = config.data.images.filter((img: { id: { toString: () => string } }) => {
      if (!img.id) return true // Mantener imágenes sin ID

      // Convertir a string para comparación
      const imgId = typeof img.id === "object" ? img.id.toString() : img.id
      const targetId = typeof imageId === "object" ? imageId.toString() : imageId

      return imgId !== targetId
    })

    // Crear una copia de la configuración actual
    const updatedConfig = { ...config.data, images: updatedImages }

    // Actualizar la configuración en la base de datos
    const result = await db.collection("config").updateOne({ name: "ipalee" }, { $set: { data: updatedConfig } })

    if (result.modifiedCount === 0) {
      console.error("No se pudo actualizar la configuración en la base de datos")
      return NextResponse.json({ success: false, message: "No se pudo actualizar la configuración" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Imagen eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar la imagen:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

