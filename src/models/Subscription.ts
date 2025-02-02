import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email address."],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema)

