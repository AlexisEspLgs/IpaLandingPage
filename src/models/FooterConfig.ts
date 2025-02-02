import mongoose from "mongoose"

const FooterConfigSchema = new mongoose.Schema({
  churchName: String,
  address: String,
  phone: String,
  email: String,
  facebookUrl: String,
  instagramUrl: String,
  tiktokUrl: String,
  newsletterTitle: String,
  newsletterDescription: String,
  copyrightText: String,
})

export default mongoose.models.FooterConfig || mongoose.model("FooterConfig", FooterConfigSchema)

