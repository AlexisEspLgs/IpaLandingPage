import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import FooterConfig from "@/models/FooterConfig"

export async function GET() {
  try {
    await connectToDatabase()
    const config = await FooterConfig.findOne()
    return NextResponse.json(config || {})
  } catch (error) {
    console.error("Error fetching Footer config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const config = await FooterConfig.findOneAndUpdate({}, data, { new: true, upsert: true })
    return NextResponse.json(config)
  } catch (error) {
    console.error("Error saving Footer config:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

