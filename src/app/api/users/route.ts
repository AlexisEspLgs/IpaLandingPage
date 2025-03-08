import { NextResponse } from "next/server"
import { auth, isFirebaseAdminInitialized } from "@/lib/firebase-admin"

export async function GET() {
  try {
    // Verificar que Firebase Admin esté inicializado correctamente
    if (!isFirebaseAdminInitialized()) {
      // Si estamos en desarrollo, devolvemos datos de prueba
      if (process.env.NODE_ENV !== "production") {
        console.log("Firebase Admin no inicializado. Devolviendo datos de prueba.")
        return NextResponse.json([
          { uid: "test1", email: "test1@example.com", displayName: "Test User 1", role: "admin" },
          { uid: "test2", email: "test2@example.com", displayName: "Test User 2", role: "user" },
        ])
      }

      throw new Error("Firebase Admin no está inicializado correctamente")
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

    // Proporcionar un mensaje de error detallado
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json(
      {
        error: "Failed to list users",
        details: errorMessage,
        // Incluir información sobre las variables de entorno (sin exponer valores sensibles)
        environment: {
          projectIdExists: !!process.env.FIREBASE_PROJECT_ID,
          clientEmailExists: !!process.env.FIREBASE_CLIENT_EMAIL,
          privateKeyExists: !!process.env.FIREBASE_PRIVATE_KEY,
        },
      },
      { status: 500 },
    )
  }
}

