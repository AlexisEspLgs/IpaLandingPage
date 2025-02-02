"use server"

import { Readable } from "stream"
import { connectToDatabase } from "./mongodb"
import { GridFSBucket, ObjectId } from "mongodb"

let bucket: GridFSBucket | null = null

async function getGridFSBucket() {
  if (!bucket) {
    const db = await connectToDatabase()
    if (!db) {
      throw new Error("Error: Database connection failed.")
    }
    bucket = new GridFSBucket(db)
  }
  return bucket
}

export async function uploadPDF(file: Buffer, fileName: string): Promise<string> {
  "use server"
  try {
    const bucket = await getGridFSBucket()
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: "application/pdf",
    })

    return new Promise<string>((resolve, reject) => {
      const readStream = new Readable()
      readStream.push(file)
      readStream.push(null)

      readStream
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", () => {
          resolve(uploadStream.id.toString())
        })
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    throw error
  }
}

export async function getPDF(fileId: string): Promise<Buffer> {
  "use server"
  try {
    const bucket = await getGridFSBucket()
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      downloadStream.on("data", (chunk) => chunks.push(chunk))
      downloadStream.on("error", reject)
      downloadStream.on("end", () => resolve(Buffer.concat(chunks)))
    })
  } catch (error) {
    console.error("Error getting PDF:", error)
    throw error
  }
}

export async function deletePDF(fileId: string): Promise<void> {
  "use server"
  try {
    const bucket = await getGridFSBucket()
    await bucket.delete(new ObjectId(fileId))
  } catch (error) {
    console.error("Error deleting PDF:", error)
    throw error
  }
}

