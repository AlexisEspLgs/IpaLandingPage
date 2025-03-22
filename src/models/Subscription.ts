import mongoose, { Schema, type Document } from "mongoose"

export interface ISubscription extends Document {
  email: string
  name?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Verificar si el modelo ya existe para evitar sobreescribirlo
const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema)

export default Subscription

