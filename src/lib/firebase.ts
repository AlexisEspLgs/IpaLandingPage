import { initializeApp, getApps } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

// Configurar el idioma de los correos electrónicos de Firebase
auth.languageCode = "es"

export { auth, db }

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const token = await user.getIdToken()

    // Store the token in a cookie that expires in 7 days
    document.cookie = `session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

    return user
  } catch (error) {
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await firebaseSignOut(auth)
    // Remove the session cookie
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (email: string) => {
  try {
    // Validación básica del email
    if (!email || email.trim() === "") {
      return {
        success: false,
        message: "Por favor, ingresa un correo electrónico válido.",
      }
    }

    // Validación de formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "El formato del correo electrónico no es válido.",
      }
    }

    // Enviar el correo de recuperación
    await sendPasswordResetEmail(auth, email)

    console.log("Correo de recuperación enviado con éxito a:", email)

    return {
      success: true,
      message:
        "Se ha enviado un correo de recuperación de contraseña. Por favor, revisa tu bandeja de entrada y sigue las instrucciones.",
    }
  } catch (error: unknown) {
    console.error("Error al enviar el correo de recuperación:", error)

    const FirebaseError = error as { code: string }

    // Proporcionar mensajes de error más específicos
    if (FirebaseError.code === "auth/user-not-found") {
      return {
        success: false,
        message: "No existe una cuenta con este correo electrónico. Por favor, verifica que el correo sea correcto.",
      }
    } else if (FirebaseError.code === "auth/invalid-email") {
      return {
        success: false,
        message: "El formato del correo electrónico no es válido. Por favor, ingresa un correo electrónico válido.",
      }
    } else if (FirebaseError.code === "auth/too-many-requests") {
      return {
        success: false,
        message: "Has realizado demasiadas solicitudes. Por favor, intenta de nuevo más tarde.",
      }
    } else if (FirebaseError.code === "auth/network-request-failed") {
      return {
        success: false,
        message: "Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.",
      }
    }

    return {
      success: false,
      message: "Error al enviar el correo de recuperación. Por favor, intenta de nuevo más tarde.",
    }
  }
}

