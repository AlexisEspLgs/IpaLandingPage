import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()

    if (!db) {
      throw new Error("Failed to connect to the database")
    }

    const count = await db.collection("blogposts").countDocuments()

    console.log("Blog post count:", count)

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Failed to get blog post count:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

