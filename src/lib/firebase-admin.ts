import * as admin from "firebase-admin"

// Verificar si ya hay aplicaciones inicializadas
if (!admin.apps.length) {
  // Asegurarse de que todas las propiedades requeridas estén presentes
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Reemplazar los caracteres de escape en la clave privada
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
  }

  // Verificar que todas las propiedades requeridas estén definidas
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error("Firebase Admin SDK: Faltan credenciales requeridas")
    // Proporcionar valores predeterminados para evitar errores durante la construcción
    serviceAccount.projectId = serviceAccount.projectId || "placeholder-project-id"
    serviceAccount.clientEmail = serviceAccount.clientEmail || "placeholder@example.com"
    serviceAccount.privateKey = serviceAccount.privateKey || "placeholder-key"
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    })
  } catch (error) {
    console.error("Error al inicializar Firebase Admin SDK:", error)
  }
}

export const auth = admin.auth()

