import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Función GET unificada que puede obtener todos los posts o uno específico por ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const db = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Si se proporciona un ID, obtener un post específico
    if (idParam) {
      // Verificar si el ID es un ObjectId válido
      let objectId: ObjectId
      try {
        objectId = new ObjectId(idParam)
      } catch {
        return NextResponse.json({ error: "ID de post inválido" }, { status: 400 })
      }

      const post = await db.collection("blogposts").findOne({ _id: objectId })

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }

      return NextResponse.json(post)
    }

    // Si no se proporciona un ID, obtener todos los posts
    const posts = await db.collection("blogposts").find({}).sort({ date: -1 }).toArray()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 })
  }
}

// Función POST para crear un nuevo post
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Validar datos requeridos
    if (!data.title || !data.content || !data.images || data.images.length === 0) {
      return NextResponse.json({ error: "Title, content, and at least one image are required." }, { status: 400 })
    }

    // Asegurar que la fecha esté en formato correcto
    if (!data.date) {
      data.date = new Date().toISOString()
    }

    const result = await db.collection("blogposts").insertOne(data)
    const newPost = await db.collection("blogposts").findOne({ _id: result.insertedId })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Error creating post" }, { status: 500 })
  }
}

// Función PUT para actualizar un post existente
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const id = data.id // El ID debe venir en el cuerpo de la solicitud

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Verificar si el ID es un ObjectId válido
    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "ID de post inválido" }, { status: 400 })
    }

    // Eliminar el ID del objeto de datos para no sobrescribirlo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = data

    const result = await db.collection("blogposts").updateOne({ _id: objectId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
    }

    const updatedPost = await db.collection("blogposts").findOne({ _id: objectId })
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Error updating post" }, { status: 500 })
  }
}

// Función DELETE para eliminar un post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")

    if (!idParam) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 })
    }

    // Verificar si el ID es un ObjectId válido
    let objectId: ObjectId
    try {
      objectId = new ObjectId(idParam)
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: "ID de post inválido" }, { status: 400 })
    }

    const result = await db.collection("blogposts").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 })
  }
}

