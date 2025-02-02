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

    // Obtener los usuarios más recientes
    const recentUsers = (await auth.listUsers(5)).users.map((user) => ({
      id: user.uid,
      email: user.email,
      lastLogin: user.metadata.lastSignInTime,
    }))

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalCarouselImages,
      recentUsers,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

