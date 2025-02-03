import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { auth } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database")
    }

    // Obtener el total de usuarios
    const totalUsers = (await auth.listUsers()).users.length

    // Obtener el total de posts
    const totalPosts = await db.collection("blogposts").countDocuments()

    // Obtener el total de imágenes en el carrusel
    const totalCarouselImages = await db.collection("carouselimages").countDocuments()

    // Obtener el total de Suscripciones 
    const totalSubscriptions = await db.collection("subscriptions").countDocuments()

    // Obtener los usuarios más recientes
    const recentUsers = (await auth.listUsers(5)).users.map((user) => ({
      id: user.uid,
      email: user.email,
      lastLogin: user.metadata.lastSignInTime,
    }))

    // Obtener los usuarios más recientes que se han suscrito
    const recentUsersSubs = await db
      .collection("subscriptions")
      .find()
      .sort({ createdAt: -1 }) // Ordena por el campo lastLogin de manera descendente
      .limit(3) // Limita la consulta a un solo documento (el más reciente)
      .toArray()

    // Si no hay suscripciones recientes, devuelve un array vacío
    const formattedRecentUsersSubs = recentUsersSubs.map(user => ({
      id: user._id.toString(), // El ID puede estar en formato ObjectId, por eso lo convertimos a string
      email: user.email,
      lastLogin: user.lastLogin,
    }))

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalCarouselImages,
      recentUsers,
      totalSubscriptions,
      recentUsersSubs: formattedRecentUsersSubs, // Mapea los datos a un formato usable
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
