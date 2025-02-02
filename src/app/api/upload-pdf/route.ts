import { NextResponse } from "next/server"
import { uploadPDF } from "@/lib/pdfStorage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`

    const fileId = await uploadPDF(buffer, fileName)

    return NextResponse.json({ fileId })
  } catch (error) {
    console.error("Error in PDF upload:", error)
    return NextResponse.json({ error: "Error uploading PDF" }, { status: 500 })
  }
}

