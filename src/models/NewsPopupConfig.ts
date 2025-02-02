import mongoose from "mongoose"

const NewsPopupConfigSchema = new mongoose.Schema({
  showPopup: {
    type: Boolean,
    default: true,
  },
  delayTime: {
    type: Number,
    default: 5000,
  },
  title: {
    type: String,
    required: [true, "Please provide a title for the popup."],
  },
  content: {
    type: String,
    required: [true, "Please provide content for the popup."],
  },
  hasPDF: {
    type: Boolean,
    default: false,
  },
  pdfId: String,
  enableSubscription: {
    type: Boolean,
    default: false,
  },
  subscriptionMessage: {
    type: String,
    default: "¡Suscríbete para recibir noticias y actualizaciones!",
  },
})

export default mongoose.models.NewsPopupConfig || mongoose.model("NewsPopupConfig", NewsPopupConfigSchema)

