import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  try {
    const id = params.id
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

    const post = await db.collection("blogposts").findOne({ _id: objectId })

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ message: "Error fetching post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
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

    const result = await db.collection("blogposts").updateOne({ _id: objectId }, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
    }

    const updatedPost = await db.collection("blogposts").findOne({ _id: objectId })
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ message: "Error updating post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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

    const result = await db.collection("blogposts").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 })
  }
}

