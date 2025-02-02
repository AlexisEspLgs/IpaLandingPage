import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Database connection failed")
    }
    const config = await db.collection("config").findOne({ name: "inicio" })
    return NextResponse.json(config?.data || {})
  } catch (error) {
    console.error("Error fetching inicio config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    const data = await request.json()
    if (!db) {
      throw new Error("Database connection failed")
    }
    await db.collection("config").updateOne({ name: "inicio" }, { $set: { data } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving inicio config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

