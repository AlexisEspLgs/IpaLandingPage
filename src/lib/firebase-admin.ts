import * as admin from "firebase-admin"

// Función para inicializar Firebase Admin SDK de manera segura
function initializeFirebaseAdmin() {
  // Verificar si ya hay aplicaciones inicializadas
  if (admin.apps.length > 0) {
    return admin
  }

  // Verificar que las variables de entorno necesarias estén definidas
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.error("Firebase Admin SDK: Faltan credenciales requeridas. Usando valores de desarrollo.")

    // En producción, esto evitará que la aplicación se inicie con credenciales incorrectas
    // En desarrollo, permitirá que la aplicación se inicie con funcionalidad limitada
    if (process.env.NODE_ENV === "production") {
      throw new Error("Firebase Admin SDK: Faltan credenciales requeridas en producción")
    }

    // Para desarrollo, inicializamos con una app vacía
    return admin
  }

  try {
    // Formatear correctamente la clave privada
    // La clave privada debe estar en formato PEM correcto con los saltos de línea adecuados
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })

    console.log("Firebase Admin SDK inicializado correctamente")
    return admin
  } catch (error) {
    console.error("Error al inicializar Firebase Admin SDK:", error)

    // En producción, propagamos el error
    if (process.env.NODE_ENV === "production") {
      throw error
    }

    return admin
  }
}

// Inicializar Firebase Admin
const firebaseAdmin = initializeFirebaseAdmin()
export const auth = firebaseAdmin.auth()

// Función auxiliar para verificar si Firebase Admin está inicializado correctamente
export function isFirebaseAdminInitialized() {
  return admin.apps.length > 0
}

