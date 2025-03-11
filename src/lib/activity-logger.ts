import { connectToDatabase } from "./mongodb"
import ActivityLog from "@/models/ActivityLog"
import type { Activity } from "@/types/activity"
import type { Types } from "mongoose"

export type ActivityAction =
  | "login"
  | "logout"
  | "create_post"
  | "update_post"
  | "delete_post"
  | "create_carousel"
  | "update_carousel"
  | "delete_carousel"
  | "update_settings"
  | "new_subscription"
  | "send_newsletter"
  | "backup_system"

export interface LogActivityParams {
  userId: string
  userEmail: string
  action: ActivityAction
  entityType?: string
  entityId?: string
  details?: string
}

/**
 * Registra una actividad en el sistema
 */
export async function logActivity({ userId, userEmail, action, entityType, entityId, details }: LogActivityParams) {
  try {
    const db = await connectToDatabase()
    if (!db) {
      console.error("No se pudo conectar a la base de datos para registrar actividad")
      return null
    }

    const activity = new ActivityLog({
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date(),
    })

    await activity.save()
    return activity
  } catch (error) {
    console.error("Error al registrar actividad:", error)
    return null
  }
}

/**
 * Obtiene las actividades recientes del sistema
 */
export async function getRecentActivities(limit = 5): Promise<Activity[]> {
  try {
    const db = await connectToDatabase()
    if (!db) {
      console.error("No se pudo conectar a la base de datos para obtener actividades")
      return []
    }

    const activities = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(limit).lean()

    // Convertir el resultado de Mongoose a nuestro tipo esperado
    return activities.map((activity) => ({
      _id: activity._id as Types.ObjectId,
      userId: activity.userId || "",
      userEmail: activity.userEmail || "",
      action: activity.action || "",
      entityType: activity.entityType,
      entityId: activity.entityId,
      details: activity.details,
      timestamp: activity.timestamp || new Date(),
    }))
  } catch (error) {
    console.error("Error al obtener actividades recientes:", error)
    return []
  }
}

/**
 * Convierte una acción en un mensaje legible
 */
export function getActionMessage(action: ActivityAction): string {
  const actionMessages: Record<ActivityAction, string> = {
    login: "inició sesión",
    logout: "cerró sesión",
    create_post: "creó un nuevo artículo",
    update_post: "actualizó un artículo",
    delete_post: "eliminó un artículo",
    create_carousel: "añadió una imagen al carrusel",
    update_carousel: "actualizó una imagen del carrusel",
    delete_carousel: "eliminó una imagen del carrusel",
    update_settings: "actualizó la configuración",
    new_subscription: "registró una nueva suscripción",
    send_newsletter: "envió un newsletter",
    backup_system: "realizó una copia de seguridad",
  }

  return actionMessages[action] || "realizó una acción"
}

/**
 * Formatea el tiempo transcurrido desde una fecha
 */
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Hace un momento"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `Hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`
}

