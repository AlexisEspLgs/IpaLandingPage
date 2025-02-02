import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Database connection failed")
    }
    const config = await db.collection("config").findOne({ name: "historia" })
    return NextResponse.json(config?.data || {})
  } catch (error) {
    console.error("Error fetching historia config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Database connection failed")
    }
    const data = await request.json()
    await db.collection("config").updateOne({ name: "historia" }, { $set: { data } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving historia config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

