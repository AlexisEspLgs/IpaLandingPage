import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const config = await db.collection("config").findOne({ name: "ipalee" })
    return NextResponse.json(config?.data || { images: [] })
  } catch (error) {
    console.error("Error fetching ipalee config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const data = await request.json()
    await db.collection("config").updateOne({ name: "ipalee" }, { $set: { data } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving ipalee config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

