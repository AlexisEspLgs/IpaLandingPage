import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { email } = await request.json()
    const subscription = await Subscription.create({ email })
    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const subscriptions = await Subscription.find({}).sort({ createdAt: -1 })
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

