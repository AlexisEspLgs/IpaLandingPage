import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const config = await db.collection("config").findOne({ name: "tiktok" })
    return NextResponse.json(config?.data || { videos: [] })
  } catch (error) {
    console.error("Error fetching TikTok config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const video = await request.json()
    const result = await db
      .collection("config")
      .updateOne({ name: "tiktok" }, { $push: { "data.videos": video } }, { upsert: true })
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error saving TikTok video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const video = await request.json()
    const result = await db
      .collection("config")
      .updateOne({ name: "tiktok", "data.videos.id": video.id }, { $set: { "data.videos.$": video } })
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error updating TikTok video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 })
    }
    const result = await db.collection("config").updateOne({ name: "tiktok" }, { pull: { "data.videos": { id: id } } })
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error deleting TikTok video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

