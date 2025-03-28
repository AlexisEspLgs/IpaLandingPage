import mongoose, { Schema, type Document } from "mongoose"

// Interfaz para los campos editables
interface EditableField {
  name: string
  type: string
  label: string
  defaultValue: string
  placeholder?: string
  group?: string
}

// Interfaz para el documento de plantilla de email
export interface IEmailTemplate extends Document {
  name: string
  description: string
  htmlContent: string
  previewImage: string
  editableFields: EditableField[]
  type: "newsletter" | "welcome" | "notification" | "other"
  createdAt: Date
  updatedAt: Date
}

// Esquema para los campos editables
const EditableFieldSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  defaultValue: { type: String, required: true },
  placeholder: { type: String },
  group: { type: String },
})

// Esquema principal para la plantilla de email
const EmailTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    previewImage: {
      type: String,
      default: "",
    },
    editableFields: [EditableFieldSchema],
    type: {
      type: String,
      enum: ["newsletter", "welcome", "notification", "other"],
      default: "newsletter",
    },
  },
  {
    timestamps: true,
  },
)

// Crear y exportar el modelo
export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema)

