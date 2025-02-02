import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import NewsPopupConfig from "@/models/NewsPopupConfig"

export async function GET() {
  try {
    await connectToDatabase()
    const config = await NewsPopupConfig.findOne()
    return NextResponse.json(config || {})
  } catch (error) {
    console.error("Error fetching NewsPopup config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const config = await NewsPopupConfig.findOneAndUpdate({}, data, { new: true, upsert: true })
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error saving NewsPopup config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

