import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"

export async function GET() {
  try {
    // Verificar que auth esté disponible
    if (!auth) {
      throw new Error("Firebase Auth no está inicializado correctamente")
    }

    const listUsersResult = await auth.listUsers()
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      role: user.customClaims?.role || "user",
    }))
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error listing users:", error)
    // Devolver una respuesta de error más detallada
    return NextResponse.json(
      {
        error: "Failed to list users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

