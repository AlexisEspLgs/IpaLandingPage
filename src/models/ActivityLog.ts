import mongoose, { Schema, type Document } from "mongoose"

export interface IActivityLog extends Document {
  userId: string
  userEmail: string
  action: string
  entityType?: string
  entityId?: string
  details?: string
  timestamp: Date
}

const ActivityLogSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
})

// Crear índice para búsquedas más rápidas por timestamp
ActivityLogSchema.index({ timestamp: -1 })

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema)

