import mongoose, { Schema, type Document } from "mongoose"

// Interfaz para los campos editables
interface EditableField {
  name: string
  type: string
  label: string
  defaultValue: string
  placeholder?: string
}

// Interfaz para el documento de plantilla de email
export interface IEmailTemplate extends Document {
  name: string
  description: string
  htmlContent: string
  previewImage: string
  editableFields: EditableField[]
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Crear y exportar el modelo
export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema)

