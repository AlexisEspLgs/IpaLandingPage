import mongoose from "mongoose"

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide the content for this post.'],
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image URL.'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  hasPDF: {
    type: Boolean,
    default: false,
  },
  pdfUrl: String,
})

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)

